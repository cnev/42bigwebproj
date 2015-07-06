var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var TicketCategory = new keystone.List('TicketCategory', {

});

TicketCategory.add({
	name: { type: String, index: true },
	assigned_staff: { type: Types.Relationship, ref: 'Staff' }
});

TicketCategory.register();
