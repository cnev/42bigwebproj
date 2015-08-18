var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Staff Model
 * ==========
 */

var Staff = new keystone.List('Staff');

Staff.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	canTicket: { type: Types.Relationship, ref: 'TicketCategory', many: true },
	deleted: {type: Boolean, default: false}
});


/**
 * Relationships
 */

Staff.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

Staff.defaultColumns = 'name, email, isAdmin';
Staff.register();
