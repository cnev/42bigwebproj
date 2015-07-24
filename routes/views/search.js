var express = require('express');
var session = require('express-session');
var ldap = require('ldapjs');
var _ = require('underscore');
var assert = require('assert');
var fs = require('fs');
var keystone = require('keystone');

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
	var view = new keystone.View(req, res);
	console.log(client);
	console.log('(|((uid=*'+req.body.search+'*)(cn=*'+req.body.search+'*)))');
	var opts = {
		filter: '(|(uid=*'+req.body.search+'*)(cn=*'+req.body.search+'*)(sn=*'+req.body.search+'*)(given-name=*'+req.body.search+'*))',
	scope: 'sub'
	//attributes: 'uid'
	};
	var to_send = '';
	client.search('ou=paris,ou=people,dc=42,dc=fr', opts, function(err, result) {
		if (err) {
			console.error('qwertyuiop');
			assert.ifError(err);
		}
		else {


			//console.log(result);

			result.on('searchEntry', function(entry) {
				client.bind(req.session.dn, req.session.pw, function(err) {
					if (err) {
						res.status(500).send("<p>Hello World of FAILED SEARCHES</p>");
						return ;
					}
					else {
						for (var key in entry.object)
					to_send += key + "<br />";
				console.log(to_send);
				console.log('entry.object.uid - ' + entry.object.uid);
				console.log('entry.object.givenName - ' + entry.object.givenName);
				console.log('entry.object.sn - ' + entry.object.sn);
				var photofile = entry.object.uid + '.jpeg';
				var photofold = '/nfs/zfs-student-4/users/2013/msorin/Documents/Travail/Groupe/42_Big_Web_Project/' + photofile;
				var fd = fs.openSync(photofold, 'w');
				fs.writeSync(fd, entry.object.jpegPhoto);
				fs.closeSync(fd);
				var to_ret = entry.object;
				to_ret.photophoto = photofold;
				res.locals.seeking = to_ret;
				view.render('search');
				//res.status(200).send(entry.object);
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
				console.log('function finished');
			});
		}

	});
})

module.exports = router;
