var express = require('express');
var session = require('express-session');

var router = express.Router();

router.get('/', function (req, res)
{
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.data = {
		tickets: []
	};
	var add_q = new Ticket(
	{
		title: 'MATTHOU MA VOLE MA LILIANAAAAA',
		author: 'Chandoo',
		publishedDate: '',
		content: 'Au voleuuuuuuuuuuur ma premiere rare mythique bouhhhhhhhh :\'(',
		priority: 'Urgent'
	});
	add_q.save();

	var q = keystone.list('Ticket').model.find()
		.where('state', 'open')
		.exec(function (err, result)
		{
			locals.data.ticket = result;
			next(err);
		});
	view.render('ticket_test');
});

module.exports.router = router;
