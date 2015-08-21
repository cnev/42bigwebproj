var express = require('express');
var session = require('express-session');
var ldap = require('ldapjs');
var _ = require('underscore');
var assert = require('assert');
var fs = require('fs');
var keystone = require('keystone');

var router = express.Router();

//var parsing = ldap.parseFilter;

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

function initLdapjs(cb){
	try {
		var client = ldap.createClient(
		{
			url: 'ldaps://ldap.42.fr:636'
		});
		cb(null, client);
	} catch(err) {
		var client = ldap.createClient(
		{
			url: 'ldap://ldap.42.fr:389'
		});
		cb(null, client);
	}
}

router.post('/', function (req, res){
	var view = new keystone.View(req, res);
	view.render('search_prompt');
});

router.post('/execute', function (req, res) {
	initLdapjs(function (err, client){
		if (err) {
			res.status(500).send('/search error');
		} else {
			console.log('session:');
			console.log(req.session);
			var view = new keystone.View(req, res);
			console.log('(|((uid=*'+req.body.search+'*)(cn=*'+req.body.search+'*)))');
			var opts =
			{
				filter: '(&(uid='+req.session.user+'))',
				scope: 'sub',
				attributes: ['sn', 'uid', 'uidNumber', 'dn', 'alias', 'cn', 'gidNumber', 'givenName']
			};
			var to_send = '';
			client.search('ou=paris,ou=people,dc=42,dc=fr', opts, function(err, result) {
				if (err) {
					console.error('qwertyuiop');
					assert.ifError(err);
				}
				else {
					console.log(result);
					result.on('searchEntry', function(entry) {
						client.bind(entry.object.dn, req.session.pw, function(err) {
							if (err) {
								res.status(500).send("<p>Hello World of FAILED SEARCHES</p>");
								return ;
							}
							else {
								console.log("HEY IS ANYONE HOME ?")
								var opts2 = {
									filter: '(&(uid='+req.body.search+'))',
									//filter: '(|(uid=*'+req.body.search+'*)(cn=*'+req.body.search+'*)(sn=*'+req.body.search+'*)(given-name=*'+req.body.search+'*))',
									scope: 'sub'
								//attributes: 'uid'
								};
								client.search('ou=paris,ou=people,dc=42,dc=fr', opts2, function(err, result2) {
									if (err) {
										console.error('qwertyuiop2');
										assert.ifError(err);
									}
									else {
										result2.on('searchEntry', function(entry2) {
											for (var key in entry2.object)
												to_send += key + "<br />";
											console.log(to_send);
											console.log('entry2.object.uid - ' + entry2.object.uid);
											console.log('entry2.object.givenName - ' + entry2.object.givenName);
											console.log('entry2.object.sn - ' + entry2.object.sn);
											var photofile = entry2.object.uid + '.jpeg';
											//var photofold = '/nfs/zfs-student-4/users/2013/msorin/Documents/Travail/Groupe/42_Big_Web_Project/' + photofile;
											var photofold = '/nfs/zfs-student-5/users/2013/cnev' + photofile;
											var fd = fs.openSync(photofold, 'w');
											fs.writeSync(fd, entry2.object.jpegPhoto);
											fs.closeSync(fd);
											var to_ret = entry2.object;
											to_ret.photophoto = photofold;
											res.locals.seeking = to_ret;
											//view.render('search');
											res.status(200).send(entry2.object);
										});
										result.on('searchReference', function(referral) {
											console.log('referral: ' + referral.uris.join());
										});
										result.on('error', function(err) {
											console.error('error: ' + err.message);
										});
										result.on('end', function(result2) {
											console.log('function finished2');
										});
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
						console.log('function finished');
					});
				}
			});
		}
	})

})

module.exports = router;
