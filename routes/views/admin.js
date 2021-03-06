var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();

var ActDriv = require('../../driver/activityDriver').ActivityDriver;
var ModDriv = require('../../driver/moduleDriver').ModuleDriver;
var UsrDrv = require('../../driver/userDriver').UserDriver;

var ActivityDriver = new ActDriv ();
var ModuleDriver = new ModDriv ();
var UserDriver = new UsrDrv ();

var Module = keystone.list('Module');
var Activity = keystone.list('Activity');
var Notation = keystone.list('Notation');
var NotationElement = keystone.list('NotationElement');
var Ticket = keystone.list('Ticket');
var TicketCategory = keystone.list('TicketCategory');

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
		ModuleDriver.create(req.body, function (code, doc){
			if (code == 500) {
				res.status(500).send(doc);
			}
			else {
				if (code != 201) {
					req.flash('error', doc);
				}
				else {
					req.flash('info', doc);
				}
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

	ModuleDriver.update(req.params.name, req.body, function (code, module) {
		if (code != 200) {
			req.flash('error', module);
			res.redirect('/module/view/'+req.params.name);
		}
		else {
			req.flash('info', 'Module successfully edited !');
			res.redirect('/module/view/' + module.name);
		}
	});
});

function setLocals_activityEdit(locals, req_ret, cb) {
	locals.edit = req_ret;
	if (locals.edit.type == 'project')
		locals.project_selected = true;
	else if (locals.edit.type == 'td')
		locals.td_selected = true;
	else
		locals.exam_selected = true;
	locals.autogroup_true = (locals.edit.auto_group == true) ? true : false;
	Module.model.find().exec(function (err, q_res){
		locals.modlist = q_res;
		Module.model.findById(locals.edit.module).exec(function (err, q2_res){
			locals.module = q2_res;
			cb(null, true);
		});

	});
}

router.get('/activity/edit/:name', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	Activity.model.findOne()
	.where('name', req.params.name)
	.exec(function (err, req_ret){
		if (err || !req_ret){
			req.flash('error', 'error finding activity to edit');
			res.redirect('/activity');
		}
		else {
			setLocals_activityEdit(locals, req_ret, function (err, ok){
				view.render('insert_activity');
			})
		}
	});
});

router.post('/activity/edit/:name', function (req, res) {

	Activity.model.update({'name': req.params.name},
	{
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
		group_size: {
			min: req.body.mingroupsize,
			max: req.body.maxgroupsize
		},
		req_corrections: req.body.reqcorrections,
		auto_group: req.body.autogroup,
		module: req.body.module,
		type: req.body.type
	},
	{'multi':false})
	.exec(function (err,result){
		Activity.model.findOne()
		.where('name', req.params.name)
		.exec(function (err, bob){
			req.flash('info', 'Activity successfully edited !');
			res.redirect('/activity/view/'+req.body.name);
		});
	});
/*
	var add_q = new Activity.model({
		name: data.name,
		description: data.description,
		subject: data.subject,
		slots: {
			max: data.slots,
			current: 0
		},
		registration: {
			begins: new Date(data.registrationbegins),
			ends: new Date(data.registrationends)
		},
		period: {
			begins: new Date(data.periodbegins),
			ends: new Date(data.periodends)
		},
		req_corrections: data.reqcorrections,
		auto_group: data.autogroup,
		module: data.module,
		type: data.type
	});
	add_q.save(function (err, q_saved) {
		if (err) {
			console.log("FAIL !");
			console.error(err);
			cb(500, err);
		}
		else {
			console.log(q_saved);
			cb(null, data.name + ' was successfully added to the activity list !');
		}
	});
*/
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
			locals.isDelModule = true;
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
		if (err == 500) {
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
			req.flash('error', 'error finding activity to delete');
			res.redirect('/module');
		}
		else {
			locals.confirm_text = 'Are you sure you want to delete this activity?';
			locals.name = req.params.name;
			locals.isDelActivity = true;
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
	else {
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
	}	//res.status(200).send(req.body);
});

router.get('/ticket', function (req, res){
	var view = new keystone.View(req, res);

	Ticket.model.find()
	.sort('updatedAt')
	.exec(function (err, tickets){
		UserDriver.getByUid(req.session.user, function (code, user){
			if (code == 500 || code == 404) {
				res.status(500).send('ErrorRoute /ticket');
			} else {
				res.locals.data = {

				};
				res.locals.data.admin = true;
				res.locals.data.tickets = tickets;
				res.locals.data.admin_id = user;
				view.render('ticket_overview');
			}
		});
	});
});

function ticketLock(req, ticket, cb) {
	ticket.state = 'locked';
	UserDriver.getByUid(req.session.user, function (code, user){
		if (code == 500 || code == 404) {
			cb(500, 'Error ticketLock');
		} else {
			ticket.openedBy = user;
			cb(null, true);
		}
	});
}

router.get('/ticket/view/:id', function (req, res){
	Ticket.model.findById(req.params.id)
	.exec(function (err, ticket){
		console.log(ticket);
		if (err) {
			res.status(err).send(err);
		} else if (!ticket) {
			req.flash('error', 'ticket not found');
			res.redirect('/admin/ticket');
		} else {
			if (ticket.state == 'locked') {
				req.flash('error', 'this ticket is locked !');
				res.redirect('/admin/ticket');
			} else {
				ticketLock(req, ticket, function (code, q_locked){
					if (code == 500 || code == 404) {
						res.status(code).send(q_locked);
					} else {
						ticket.save(function (err, saved) {
							console.log(ticket);
							req.flash('info', 'this ticket is now locked !');
							res.redirect('/admin/ticket');
						});
					}
				});
			}
		}
	});
});

module.exports = router;
