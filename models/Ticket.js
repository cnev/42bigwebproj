var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Ticket = new keystone.List('Ticket', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

Ticket.add({
	title: { type: String, initial: 'title', required: true },
	state: { type: Types.Select, options: 'open, locked, closed', default: 'open' },
	author: { type: String },
	content: { type: Types.Textarea },
	category: { type: Types.Relationship, ref: 'TicketCategory' },
	priority: { type: Types.Select, options: 'Non Important, Normal, Important, Urgent, Over 9000', default: 'Normal' },
	deleted: {type: Boolean, default: false}
});

Ticket.defaultColumns = 'title, state|20%, author|20%, category|20%';
//Ticket.defaultColumns = 'title';
Ticket.register();
