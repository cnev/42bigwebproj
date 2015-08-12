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
	state: { type: Types.Select, options: 'new, open, close', default: 'open' },
	author: { type: Types.Relationship, ref: 'User' },
	publishedDate: { type: Types.Date, default: Date.now },
	content: { type: Types.Textarea },
	category: { type: Types.Relationship, ref: 'TicketCategory' },
	priority: { type: Types.Select, options: 'Non Important, Normal, Important, Urgent, Over 9000', default: 'Normal' }
});

Ticket.defaultColumns = 'title, state|20%, author|20%, category|20%';
//Ticket.defaultColumns = 'title';
Ticket.register();
