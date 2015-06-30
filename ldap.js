var ldap = require('ldapjs');
var assert = require('assert');

var client = ldap.createClient({
  url: 'ldap://ldap.42.fr:389'
});

client.bind('uid=cnev,ou=august,ou=2013,ou=paris,ou=people,dc=42,dc=fr', 'Crls.mR5', function(err) {
  assert.ifError(err);
});

var opts = {
  filter: '(&(uidNumber=5491))',
  scope: 'sub'
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
