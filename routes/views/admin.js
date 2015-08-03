var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();

var Module = keystone.list('Module');
var Activity = keystone.list('Activity');

function fetch_moduleId(name) {
	Module.findOne({'name': name})
		.exec(function (err, module){
			return (module._id);
		});
}

router.get('/', function (req, res) {

	var view = new keystone.View(req, res);

	view.render('index');
});

router.get('/module', function (req, res) {

	var view = new keystone.View(req, res);

	view.render('module_overview');
});

router.get('/module/new', function (req, res) {

	var view = new keystone.View(req, res);

	//req.flash('error', 'should be /admin/module/new');
	view.render('insert_module');
});

router.post('/module/new', function (req, res) {
	if (!req.body) {// || !req.body.submit){
		req.flash('error', 'form error');
		res.redirect('/admin/module/new');
	}
	else {
		console.log(req.body);
		var add_q = new Module.model({
			name: req.body.name,
			description: req.body.description,
			slots: {
				max: req.body.slots,
				current: 0
			},
			registration: {
				begins: new Date(req.body.registrationbegins),
				ends: new Date(req.body.registrationends)
			},
			period: {
				begins: new Date(req.body.periodbegins),
				ends: new Date(req.body.periodends)
			},
			credits: req.body.credits
		});
		add_q.save(function (err, q_saved) {
			if (err) {
				console.error(err);
				res.status(500).send(err);
			}
			else {
				console.log(q_saved);
				req.flash('info', req.body.name+' was successfully added to the module list !');
				res.redirect('/admin/module');
			}
		});
	}
});

router.get('/activity/new', function (req, res) {

	var view = new keystone.View(req, res);

	//req.flash('error', 'should be /admin/module/new');
	view.render('insert_activty');
});

router.post('/activity/new', function (req, res) {
	if (!req.body) {// || !req.body.submit){
		req.flash('error', 'form error');
		res.redirect('/admin/activity/new');
	}
	else {
		console.log(req.body);
		var add_q = new Activity.model({
			name: req.body.name,
			description: req.body.description,
			subject: req.body.subject,
			slots: {
				max: req.body.slots,
				current: 0
			},
			registration: {
				begins: new Date(req.body.registrationbegins),
				ends: new Date(req.body.registrationends)
			},
			period: {
				begins: new Date(req.body.periodbegins),
				ends: new Date(req.body.periodends)
			},
			req_corrections: req.body.reqcorrections,
			auto_group: req.body.autogroup,
			module: fetch_moduleId(req.body.module),
			type: req.body.type
		});
		add_q.save(function (err, q_saved) {
			if (err) {
				console.error(err);
				res.status(500).send(err);
			}
			else {
				console.log(q_saved);
				req.flash('info', req.body.name+' was successfully added to the module list !');
				res.redirect('/admin/activity');
			}
		});
	}
});

router.get('/activity', function (req, res) {

	var view = new keystone.View(req, res);

	view.render('activity_overview');
});

router.get('/module/:name', function (req, res) {

	var view = new keystone.View(req, res);

	//view.render('index');
});

router.get('/activity/:name', function (req, res) {

	var view = new keystone.View(req, res);

	//view.render('index');
});



module.exports = router;
