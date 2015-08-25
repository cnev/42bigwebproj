var express = require('express');
var session = require('express-session');
var ldap = require('ldapjs');
var keystone = require('keystone');
var passhash = require('password-hash');

var UsrDriv = require('../../driver/userDriver').UserDriver;

var UserDriver = new UsrDriv ();

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
	var view = new keystone.View(req, res);
	view.render('login');
});

router.post('/', function (req, res)
{
	var client;

	try
	{
		client = ldap.createClient(
		{
			url: 'ldaps://ldap.42.fr:636'
		});
	}
	catch(err)
	{
		client = ldap.createClient(
		{
			url: 'ldap://ldap.42.fr:389'
		});
	}

	var opts =
	{
		filter: '(&(uid='+req.body.username+'))',
		scope: 'sub',
		attributes: ['sn', 'uid', 'uidNumber', 'dn', 'alias', 'cn', 'gidNumber', 'givenName', 'jpegPhoto']
	};
	client.search('ou=paris,ou=people,dc=42,dc=fr', opts, function(err, result)
	{
		result.on('searchEntry', function(entry)
		{
			client.bind(entry.object.dn, req.body.password, function(err)
			{
				if (err)
				{
					req.flash('error', 'Wrong User / Password !');
					res.status(401).redirect('/login');
				}
				else
				{
					var logger = entry.object;
					/*User.model.findOne({'uid':logger.uid}).exec(function (err, usr) {
						if (err) {
							console.error(err);
							res.status(500).send(err);
						}
						else if (!usr) {
							var newUser = new User.model({
								name: { first: logger.givenName, last: logger.sn },
								uid: logger.uid,
								password: passhash.generate(req.body.password, {'algorithm':'whirlpool', 'saltLength':16, 'iteration':3}),
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
									sess.isAdmin = (usrsaved.isStaff.bocalStaff || usrsaved.isStaff.bocalStudent) ? true : false;
									res.redirect("/");
								}
							});
						}
						else if (passhash.verify(req.body.password, usr.password)) {
							req.flash('error', 'Wrong password !');
							res.status(501).redirect('/login');
						}*/
					UserDriver.toLog(logger, req.body.password, function (code, usr) {
						if (code == 500) {
							res.status(code).send(user);
						}
						else {
							var sess = req.session;
							sess.user = req.body.username;
							sess.user_id = usr;
							sess.pw = usr.password;
							sess.dn = entry.object.dn;
							sess.logged = true;
			 				sess.userClass = usr.isStaff.bocalStaff ? 'staff' :
									(usr.isStaff.bocalStudent ? 'bocal' : 'student');
							sess.isAdmin = (usr.isStaff.bocalStaff || usr.isStaff.bocalStudent) ? true : false;
							req.session.forceLog = false;
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
