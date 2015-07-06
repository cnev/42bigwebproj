var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	dn: 'uid=msorin,ou=august,ou=2013,ou=paris,ou=people,dc=42,dc=fr',
	controls: [],
	alias: { type: Types.email, many: true }
	[ 'msorin@student.42.fr',
	'sorin.mickael@student.42.fr',
	'mickael.sorin@student.42.fr' ],
	cn: 'Mickael SORIN',
	gidNumber: '4207',
	givenName: 'Mickael',
	jpegPhoto:'',
	loginShell: '/bin/zsh',
	objectClass:
	[ 'posixAccount',
	'shadowAccount',
	'apple-user',
	'ftUser',
	'inetOrgPerson',
	'ftExtended' ],
	sn: 'SORIN',
	uid: 'msorin',
	uidNumber: '5514',
	homeDirectory: '/nfs/zfs-student-4/users/2013/msorin'
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
