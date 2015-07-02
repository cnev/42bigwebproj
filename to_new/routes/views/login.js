var express = require('express');
var ldap = require('ldapjs');
var assert = require('assert');

var router = express.Router();

router.get('/', function (req, res) {
			var test = "<div><form action='/login' method='POST'><label for='username'>Username:</label><input type='text' id='username' name='username'><label for='password'>Password:</label><p><a href='#'>Forgot your password?</a></p><input type='password' id='password' name='password'><div><input type='checkbox'><label class='check' for='checkbox'>Keep me logged in</label><input type='submit' value='Login'></div></form></div>";
			res.status(200).send(test);

	});

router.post('/', function (req, res) {
	var client = ldap.createClient({
	url: 'ldap://ldap.42.fr:389'
});
	var opts = {
	filter: '(&(uid='+req.body.username+'))',
	scope: 'sub',
	attributes: 'dn'
};
	client.search('ou=paris,ou=people,dc=42,dc=fr', opts, function(err, res) {
	assert.ifError(err);

	res.on('searchEntry', function(entry) {
		console.log('entry: ' + JSON.stringify(entry.object));
	});
	res.on('searchReference', function(referral) {
		console.log('referral: ' + referral.uris.join());
	});
	res.on('error', function(err) {
		console.error('error: ' + err.message);
	});
	res.on('end', function(result) {
		console.log('status: ' + result.status);
	});
});
	var testo = "<p>Hello World of POST</p>";
	res.status(200).send(testo);


})

module.exports = router;

