var express = require('express');
var session = require('express-session');
var ldap = require('ldapjs');

var router = express.Router();

router.post('/', function (req, res) {
	var client = ldap.createClient({
	url: 'ldap://ldap.42.fr:389'
});
	//var filter = "'(uid=*"+req.body.username+"*)'";
	//console.log("testing filter: "+filter);
	/*var f = new ApproximateFilter({
  		attribute: 'cn',
 		value: 'foo'
	});*/
	console.log('(|((uid=*'+req.body.username+'*)(cn=*'+req.body.username+'*)(sn=*'+req.body.username+'*)(given-name=*'+req.body.username+'*)))');
	var opts = {
	filter: '(&(givenName=*'+req.body.username+'*))',
	scope: 'sub',
	attributes: 'uid'
};
	//var user_dn = '';
	//console.log('(uid=*'+req.body.username+'*)');
	var to_send = '';
	client.search('ou=paris,ou=people,dc=42,dc=fr', opts, function(err, result) {
	//assert.ifError(err);

	result.on('searchEntry', function(entry) {
		//console.log('entry: ' + JSON.stringify(entry.object));
		//console.log('test: ' + entry.object.dn);

		client.bind(req.session.dn, req.session.pw, function(err) {
		if (err) {
			// error case;	assert.ifError(err);
			res.status(200).send("<p>Hello World of FAILED SEARCHES</p>");

		}
		else {

			to_send += "<p>"+entry.object.uid+"</p><br />";
			console.log(entry.object.uid);

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
	res.status(200).send(to_send);
})

module.exports = router;
