var express = require('express');
var session = require('express-session');
var ldap = require('ldapjs');
var keystone = require('keystone');
var router = express.Router();
var User = keystone.list('User');

function checkbocalstaff(usrName) {
	return(usrName ? false : false);
}

function checkbocalstudent(usrName) {
	return(usrName ? false : false);
}

router.get('/', function (req, res)
{
	//var test = "<div><form action='/login' method='POST'><label for='username'>Username:</label><input type='text' id='username' name='username'><label for='password'>Password:</label><p><a href='#'>Forgot your password?</a></p><input type='password' id='password' name='password'><div><input type='checkbox'><label class='check' for='checkbox'>Keep me logged in</label><input type='submit' value='Login'></div></form></div>";
	//res.status(200).send(test);
	var view = new keystone.View(req, res);
	req.session.atLogin = true;
	view.render('login');
});

router.post('/', function (req, res)
{
	try
	{
		var client = ldap.createClient(
		{
			url: 'ldaps://ldap.42.fr:636'
		});
	}
	catch(err)
	{
		console.log('la connexion via ldaps a echoue, tentative de connexion via ldap')
		client = ldap.createClient(
		{
			url: 'ldap://ldap.42.fr:389'
		});
	}

	var opts =
	{
		filter: '(&(uid='+req.body.username+'))',
		scope: 'sub',
		attributes: ['sn', 'uid', 'uidNumber', 'dn', 'alias', 'cn', 'gidNumber', 'givenName']
	};
	client.search('ou=paris,ou=people,dc=42,dc=fr', opts, function(err, result)
	{
	//assert.ifError(err);
		result.on('searchEntry', function(entry)
		{
			//console.log('entry: ' + JSON.stringify(entry.object));
			console.log(entry);
			console.log('/* *************** */');
			console.log(entry.object);
			//console.log('test: ' + entry.object.dn);
			client.bind(entry.object.dn, req.body.password, function(err)
			{
				if (err)
				{
					// error case;	assert.ifError(err);
					console.log("Failed login ... maybe ?");
					res.status(200).send("<p>Hello World of FAILED LOGINS</p>");
				}
				else
				{
					var logger = entry.object;
					User.model.findOne({'uid':logger.uid}).exec(function (err, usr) {
						if (err) {
							console.error(err);
							res.status(500).send(err);
						}
						else if (!usr) {
							/*add user to db*/
							var newUser = new User.model({
								name: { first: logger.givenName, last: logger.sn },
								uid: logger.uid,
								password: req.body.password,
								email: logger.alias[0],
								uidNumber: logger.uidNumber,
								gidNumber: logger.gidNumber
							});
							newUser.save(function (err, usrsaved) {
								if (err) {
									console.error(err);
									res.status(500).send(err);
								}
								else {
									var sess = req.session;
									sess.user = usrsaved.uid;
									sess.pw = usrsaved.password;
									sess.dn = entry.object.dn;
									sess.logged = true;
									sess.userClass = usrsaved.isStaff.bocalStaff ? 'staff' :
											(usrsaved.isStaff.bocalStudent ? 'bocal' : 'student');
									sess.atLogin = false;
									res.redirect("/");
								}
							});
						}
						else {
							console.log("Successful login ... maybe ?");
							var sess = req.session;
							sess.user = req.body.username;
							sess.pw = req.body.password;
							sess.dn = entry.object.dn;
							sess.logged = true;
			 				sess.userClass = usr.isStaff.bocalStaff ? 'staff' :
									(usr.isStaff.bocalStudent ? 'bocal' : 'student');
							console.log(entry.object);
							sess.atLogin = false;
							res.redirect("/");
						}
					});
				}
			});
		});
		result.on('searchReference', function(referral) {
			console.log('referral: ' + referral.uris.join());
		});
		result.on('error', function(err) {
			console.error('error: ' + err.message);
		});
		result.on('end', function(result) {
			console.log('status: ' + result.status);
		});
	});
});

module.exports = router;
