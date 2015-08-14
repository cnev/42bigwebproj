var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();

var ActDriv = require('../../driver/activityDriver').ActivityDriver;

var ActivityDriver = new ActDriv ();

var Module = keystone.list('Module');
var Activity = keystone.list('Activity');
var Notation = keystone.list('Notation');
var NotationElement = keystone.list('NotationElement');

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
				req.flash('info', req.body.name+' was successfully added to the module list !');
				res.redirect('/module');
			}
		});
	}
});

router.get('/module/edit/:name', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	Module.model.findOne()
	.where('name', req.params.name)
	.exec(function (err, req_ret){
		if (err || !req_ret){
			req.flash('error', 'error finding module to edit');
			res.redirect('/module');
		}
		else {
			locals.edit = req_ret;
			view.render('insert_module');
		}
	});
});

router.post('/module/edit/:name', function (req, res) {

	Module.model.update({'name': req.params.name},
		{
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
		},
		{'multi':false})
	.exec(function (err,result){
		Module.model.findOne()
		.where('name', req.params.name)
		.exec(function (err, bob){
			req.flash('info', 'Module successfully edited !');
			res.redirect('/module/view/'+req.params.name);
		});
	});
});

router.get('/module/delete/:name', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	Module.model.findOne()
	.where('name', req.params.name)
	.exec(function (err, req_ret){
		if (err || !req_ret){
			req.flash('error', 'error finding module to delete');
			res.redirect('/module');
		}
		else {
			locals.confirm_text = 'Are you sure you want to delete this module?';
			locals.name = req.params.name;
			locals.isModule = true;
			view.render('confirm_action');
		}
	});
});

router.post('/module/delete/:name', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	if (req.body.answer == 'yes') {
		Module.model.findOne()
		.where('name', req.params.name)
		.remove(function (err){
			if (err){
				req.flash('error', 'Error deleting module ...');
				res.redirect('/module');
			} else {
				req.flash('info', 'Module was successfully deleted !');
				res.redirect('/module');
			}
		});
	} else {
		req.flash('info', 'Module was not deleted because you said NO');
		res.redirect('/module');
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
		ActivityDriver.create(req.body, function (err, q_saved) {
			if (err) {
				console.log("FAIL !");
				console.error(q_saved);
				res.status(err).send(q_saved);
			}
			else {
				console.log(q_saved);
				req.flash('info', q_saved);
				res.redirect('/activity');
			}
		});
	}
});

router.get('/activity/delete/:name', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	Activity.model.findOne()
	.where('name', req.params.name)
	.exec(function (err, req_ret){
		if (err || !req_ret){
			req.flash('error', 'error finding module to delete');
			res.redirect('/module');
		}
		else {
			locals.confirm_text = 'Are you sure you want to delete this activity?';
			locals.name = req.params.name;
			locals.isActivity = true;
			view.render('confirm_action');
		}
	});
});

router.post('/activity/delete/:name', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	if (req.body.answer == 'yes') {
		Activity.model.findOne()
		.where('name', req.params.name)
		.remove(function (err){
			if (err){
				req.flash('error', 'Error deleting activity ...');
				res.redirect('/module');
			} else {
				req.flash('info', 'Activity was successfully deleted !');
				res.redirect('/module');
			}
		});
	} else {
		req.flash('info', 'Activity was not deleted because you said NO');
		res.redirect('/module');
	}
});

router.get('/notation', function (req, res) {
	var view = new keystone.View(req, res);

	view.render('notation_overview');
});

router.get('/notation/new', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.actlist = [];

	Activity.model.find()
	.sort('name')
	.exec(function (err, q_res){
		for (var i = 0; i < q_res.length; i++){
			var data = {
				name: q_res[i].name,
				_id: q_res[i]._id
			}
			locals.actlist.push(data);
			if (i == q_res.length - 1)
				view.render('insert_notation');
		}
	});
});

function addNotationElement(id, body, cb)
{
	var label = 'element'+id;
	var label_title = 'element'+id+'_title';
	var label_text = 'element'+id+'_text';
	var label_grade = 'element'+id+'_grade';

	if (!(body[label]))
		cb(1);
	else {
		console.log('body');
		console.log(body[label_title]);
		console.log(body[label_text]);
		console.log(body[label_grade]);
		console.log('endof body');
		var add_q = new NotationElement.model({
			title: body[label_title],
			text: body[label_text],
			grade: body[label_grade]
		});
		add_q.save(function (err, q_saved){
			if (err) {
				cb(1);
			}
			else {
				cb(null, add_q);
			}
		})
	}
}

function build_contents(req, res, cb)
{
	var body = req.body;
	var contents = [];
	var num = (body.nb_elements - 1) + 1;

	console.log('elements: '+num);
	for (var i = 0; i < num; i++){
		addNotationElement(i + 1, body, function(err, newElement){
			contents.push(newElement);
			if (contents.length == num)
				cb(null, contents);
		});
	}
}

router.post('/notation/new', function (req, res) {

	if (!req.body){// || !req.body.submit){
		req.flash('error', 'form error');
		res.redirect('/admin/notation/new');
	}
	else{
		build_contents(req, res, function (err, content_res){
			console.log('content_res');
			console.log(content_res);
			console.log('end of content_res');
			var add_q = new Notation.model({
				activity: req.body.activity,
				contents: content_res
			});
			add_q.save(function (err, q_saved) {
				if (err) {
					console.error(err);
					res.status(500).send(err);
				}
				else {
					console.log(q_saved);
					req.flash('info', 'New notation added to the list !');
					res.redirect('/');
				}
			});
		});
	}
	//res.status(200).send(req.body);
});

module.exports = router;
