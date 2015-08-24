var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();

var TicketCategory = keystone.list('TicketCategory');
var Ticket = keystone.list('Ticket');

var UsrDrv = require('../../driver/userDriver').UserDriver;
var UserDriver = new UsrDrv();

router.get('/', function (req, res){
	if (req.session.isAdmin) {
		res.redirect('/admin/ticket');
	} else {
		var view = new keystone.View(req, res);
		UserDriver.getByUid(req.session.user, function (err, user){
			Ticket.model.find()
			.where('createdBy', user)
			.sort('~updatedAt')
			.exec(function (err, tickets){
				if (err) {
					res.status(err).send(err);
				} else {
					res.locals.data = {

					};
					res.locals.data.tickets = tickets;
					view.render('ticket_overview');
				}
			});
		});
	}
});

router.get('/new', function (req, res){
	var view = new keystone.View(req, res);
	TicketCategory.model.find()
	.sort('name')
	.exec(function (err, cat){
		if (err) {
			res.status(err).send(err);
		} else {
			res.locals.categorylist = cat;
			view.render('write_ticket');
		}
	});
});

router.post('/new', function (req, res){
	var view = new keystone.View(req, res);
	var ticket = new Ticket.model({
		title: req.body.title,
		author: req.session.user,
		content: req.body.contents,
		category: req.body.category
	});
	ticket._req_user = req.session.user_id;
	ticket.save(function (err, ticket_saved){
		if (err){
			res.status(err).send(err);
		} else {
			req.flash('info', 'ticket sent !');
			res.redirect('/ticket');
		}
	})
});



module.exports = router;
