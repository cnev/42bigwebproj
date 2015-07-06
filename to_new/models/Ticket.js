var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Ticket = new keystone.List('Ticket', {
	});

Ticket.add({
	title: { type: String, initial: 'title', required: true },
	state: { type: Types.Select, options: 'new, open, close', default: 'open' },
	author: { type: Types.Relationship, ref: 'User' },
	publishedDate: { type: Types.Date },
	content: { type: Types.Textarea },
	category: { type: Types.Relationship, ref: 'TicketCategory' }
});

Ticket.defaultColumns = 'title';
Ticket.register();
