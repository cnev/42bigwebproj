var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

User.add({
	uid: { type: String },
	uidNumber: { type: Number },
	gidNumber: { type: Number },
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	isStaff: {
		bocalStaff: { type: Boolean, default: false },
		bocalStudent: { type: Boolean, default: false }
	},
	autologin: {type: String},
	deleted: {type: Boolean, default: false}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
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
