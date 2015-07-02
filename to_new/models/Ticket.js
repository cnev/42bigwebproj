var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Ticket = new keystone.List('Ticket', {
	});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'new, open, close', default: 'open' },
	author: { type: Types.Relationship, ref: 'User' },
	publishedDate: { type: Types.Date },
	content: { type: Types.Textarea },
	category: { type: Types.Relationship, ref: 'TicketCategory' }
});

Post.defaultColumns = 'title, state|20%, author|20%, category|20%';
Post.register();
