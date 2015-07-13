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
			});
		view.render('ticket_test');
	});
});

module.exports = router;
