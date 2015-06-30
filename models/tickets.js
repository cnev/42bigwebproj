var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('Ticket');

Ticket.add({
	number: { type: Types.Number, required: true, index: true },
	issuedBy: { type: Types.Name, required: true },
	assignedTo: { type: Types.Name, required: false},
	content: { type: Types.Text, required: true},
	solved: { type: Types.Boolean, required: true}
});

Ticket.register();
