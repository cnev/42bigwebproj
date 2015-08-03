var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();

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

	req.flash('error', 'should be /admin/module/new');
	view.render('index');
});

router.post('/module/new', function (req, res) {
	if (!req.body || !req.body.submit){
		req.flash('error', 'form error');
		res.redirect('/admin/module/new');
	}
	else {
		var add_q = new Module.model({
			name: req.body.name,
			description: req.body.description,
			slots: {
				max: req.body.slots,
				current: 0
			},
			registration: {
				begins: req.body.registrationbegins,
				ends: req.body.registrationends
			},
			period: {
				begins: req.body.periodbegins,
				ends: req.body.periodends
			},
			credits: req.body.credits
		});
		add_q.save(function (err, q_saved) {
			req.flash('info', req.body.name+' was successfully added to the module list !');
			res.redirect('/admin/module');
		});

	}
});

router.get('/activity', function (req, res) {

	var view = new keystone.View(req, res);

	//view.render('index');
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
