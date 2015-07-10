var express = require('express');
var session = require('express-session');
var keystone = require('keystone');

var Ticket = keystone.list('Ticket');

var router = express.Router();

router.get('/', function (req, res)
{
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.data = {
		tickets: []
	};
	var add_q = new Ticket.model(
	{
		title: 'MATTHOU MA VOLE MA LILIANAAAAA',
		publishedDate: '',
		content: 'Au voleuuuuuuuuuuur ma premiere rare mythique bouhhhhhhhh :\'(',
		priority: 'Urgent'
	});
	add_q.save(function (err, q_saved) {
		var q = Ticket.model.find()
			.exec(function (err, result)
			{
				for (var i = 0; i < result.length; i++)
				{
					locals.data.tickets.push(result[i]);
				}
				for (var i = 0; i < locals.data.tickets.length; i++)
				{
					console.log("New Ticket:");
					console.log(locals.data.tickets[i]);
				}
				//locals.data.tickets = result;
				//console.log(result);
			});
		view.render('ticket_test');
	});
});

module.exports = router;
