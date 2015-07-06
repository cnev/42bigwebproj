var express = require('express');
var session = require('express-session');
var ldap = require('ldapjs');

var router = express.Router();

router.get('/', function (req, res)
{
	var test = "<div><form action='/login' method='POST'><label for='username'>Username:</label><input type='text' id='username' name='username'><label for='password'>Password:</label><p><a href='#'>Forgot your password?</a></p><input type='password' id='password' name='password'><div><input type='checkbox'><label class='check' for='checkbox'>Keep me logged in</label><input type='submit' value='Login'></div></form></div>";
	res.status(200).send(test);
});

router.post('/', function (req, res)
{
	console.log("Trying to connecto tototo ldaps");
	var client = ldap.createClient(
	{
		url: 'ldaps://ldap.42.fr:636'
	});
	console.log("Connected...maybe");

	var opts =
	{
		filter: '(&(uid='+req.body.username+'))',
		scope: 'sub',
		attributes: 'dn'
	};
	client.search('ou=paris,ou=people,dc=42,dc=fr', opts, function(err, result)
	{
	//assert.ifError(err);
		console.log("Searching ... maybe ?");
		result.on('searchEntry', function(entry)
		{
			//console.log('entry: ' + JSON.stringify(entry.object));
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
					console.log("Successful login ... maybe ?");
					var sess = req.session;
					sess.user = req.body.username;
					sess.pw = req.body.password;
					sess.dn = entry.object.dn;
					sess.logged = 'true';
					console.log(entry.object);
					res.redirect("/");
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
