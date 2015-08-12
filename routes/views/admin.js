var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();

var Module = keystone.list('Module');
var Activity = keystone.list('Activity');

router.get('/', function (req, res) {

	var view = new keystone.View(req, res);

	view.render('index');
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
		add_q.save(function (err, q_saved){
			if (err){
				console.error(err);
				res.status(500).send(err);
			}
			else {
				console.log(q_saved);
				req.flash('info', req.body.name+' was successfully added to the module list !');
				res.redirect('/module');
			}
		});
	}
});

router.get('/activity/new', function (req, res){

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.modlist = [];

	var q = Module.model.find()
		.sort('name')
		.exec(function(err, q_res){
			for (var i = 0; i < q_res.length; i++){
				var data = {
					name: q_res[i].name,
					_id: q_res[i]._id
				}
				locals.modlist.push(data);
				if (i == q_res.length - 1)
					view.render('insert_activity');
			}
		});
});

function fetch_moduleId(name){
	Module.model.findOne({'name': name})
		.exec(function (err, module){
			return (module._id);
		});
}

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
			module: req.body.module,
			type: req.body.type
		});
		add_q.save(function (err, q_saved) {
			if (err) {
				console.log("FAIL !");
				console.error(err);
				res.status(500).send(err);
			}
			else {
				console.log(q_saved);
				req.flash('info', req.body.name+' was successfully added to the activity list !');
				res.redirect('/activity');
			}
		});
	}
});

module.exports = router;
