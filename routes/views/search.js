var express = require('express');
var session = require('express-session');
var ldap = require('ldapjs');
var _ = require('underscore');
var assert = require('assert');

var router = express.Router();

var parsing = ldap.parseFilter;

//var filter = "'(uid=*"+req.body.search+"*)'";
//console.log("testing filter: "+filter);
/*var f = new ApproximateFilter({
attribute: 'cn',
value: 'foo'
});*/

//var user_dn = '';
//console.log('(uid=*'+req.body.search+'*)');

//assert.ifError(err);

//console.log('entry: ' + JSON.stringify(entry.object));
//console.log('test: ' + entry.object.dn);

// error case;	assert.ifError(err);

var client = ldap.createClient({
	url: 'ldap://ldap.42.fr:389'
});

router.post('/', function (req, res) {
	/*var client = ldap.createClient({
		url: 'ldap://ldap.42.fr:389'
	});*/
	console.log(client);
	console.log('(|((uid=*'+req.body.search+'*)(cn=*'+req.body.search+'*)(sn=*'+req.body.search+'*)(given-name=*'+req.body.search+'*)))');
	var opts = {
		filter: '(|((uid=*'+req.body.search+'*)(cn=*'+req.body.search+'*)(sn=*'+req.body.search+'*)(given-name=*'+req.body.search+'*)))',
		scope: 'sub',
		attributes: 'uid'
	};
	var to_send = '';
	client.search('ou=paris,ou=people,dc=42,dc=fr', opts, function(err, result) {
		if (err) {
			console.error('qwertyuiop');
		assert.ifError(err);

		}
		else {


			console.log(result)

			result.on('searchEntry', function(entry) {
				client.bind(req.session.dn, req.session.pw, function(err) {
					if (err) {
						res.status(500).send("<p>Hello World of FAILED SEARCHES</p>");
						return ;
					}
					else {
						to_send += "<p>"+entry.object.uid+"</p><br />";
						console.log('entry.object.uid - ' + entry.object.uid);
			res.status(200).send(to_send);
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
				console.log(result);
				console.log('status: ' + result.status);
			});
		}

	});
})

module.exports = router;
