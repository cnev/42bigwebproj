var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var Activity = keystone.list('Activity');

var ActDriv = require('../../driver/activityDriver').ActivityDriver;
var AcrRDrv = require('../../driver/actRegisDriver').ActRegisDriver;
var UsrDrv = require('../../driver/userDriver').UserDriver;

var ActivityDriver = new ActDriv ();
var ActRegisDriver = new AcrRDrv ();
var UserDriver = new UsrDrv ();

//var Activity = keystone.list('Activity');

var ActivityRegistration = keystone.list('ActivityRegistration');
var Module = keystone.list('Module');
var User = keystone.list('User');

var router = express.Router();

router.get('/', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.data = {
		activities: []
	};
	var q = ActivityDriver.getActivities(function (err, q_res) {
			if (err == 500) {
				res.status(err).send(q_res);
			}
			else if (err == 404) {
				res.status(err).send(q_res);
			}
			else
			{
				for (var i = 0; i < q_res.length; i++) {
					locals.data.activities.push(q_res[i]);
					if (i == q_res.length - 1) {
						locals.data.path = req.route.path;
						view.render('activity_overview');
					}
				}
				//temporary display
				/*var to_send = '';
				for (var i = 0; i < locals.data.activities.length; i++)
					to_send += '<p>'+locals.data.activities[i].name+'</p>';
				res.status(200).send(to_send);*/
			}
		});
});

router.get('/view/:name', function (req, res) {
	console.log(req.params.name);
	var q = ActivityDriver.getOne(req.params.name, function(err, q_res) {
				if (err == 500) {
					res.status(err).send(q_res);
				}
				else if (err == 404) {
					res.status(err).send(q_res);
				}
				else
				{
					var locals = res.locals;
					var q2 = Module.model.findById(q_res.module)
						.exec(function (err, q2_res)
					{
						if (err)
							res.status(500).send('internal error');
						else if (!q2_res)
							res.status(404).send('NOPE');
						else
						{
							var result = {
								activity: q_res,
								module: q2_res
							};
							res.locals.result = result;
							var view = new keystone.View(req, res);
							console.log('testing subject var');
							console.log(result.activity.subject);
							view.render('view_activity');
						}
					});
				}
			});
});

router.get('/register/:name', function (req, res) {
	var locals = res.locals;
	console.log('route: '+req.route.path);
	var view = new keystone.View(req, res);
	console.log(req.params.name);
	var q = Activity.model.findOne({'name': req.params.name})
	.exec(function (err, q_res) {
		if (err)
		{
			res.status(500).send('internal error');
		}
		else if (!q_res)
		{
			res.status(404).send('NOPE');
		}
		else
		{
			var search_user, search_model;
			var user_q = User.model.findOne({'uid': req.session.user})
			.exec(function (err, user_q_res) {
				search_user = user_q_res._id;
				var model_q = Activity.model.findOne({'name': req.params.name})
				.exec(function (err, model_q_res) {
					var now = new Date();
					if (model_q_res.registration.ends.getTime() < now.getTime()) {
						req.flash('error', 'Registrations are over, you cannot register to this activity anymore !');
						res.redirect('/activity/view/'+req.params.name);
					}
					else {
						search_model = model_q_res._id;
						var q2 = ActivityRegistration.model.findOne({'user': search_user})
						.where('activity', search_model)
						.exec(function (err, q2_res) {
							if (err)
								res.status(500).send(err);
							else if (!q2_res)
							{
								locals.group_size = model_q_res.group_size.max;
								locals.name = req.params.name;
								view.render('create_projectgroup');
							}
							else
							{
								req.flash('error', 'You are already registered to this activity !');
								res.redirect('/activity');
							}
						});
					}
				});
			});
		}
	});
});

router.post('/register/:name', function (req, res) {
	var view = new keystone.View(req, res);
	if (!req.body || !req.body.answer)
		res.status(500).send('httpshitstorm');
	else if (req.body.answer == 'yes')
	{
		console.log("answer is yes");
		UserDriver.getUsers(req.body.members, function (err, members){
			if (err) {
				res.status(err).send(err);
			} else {
				ActRegisDriver.preRegister(req.params.name, req.session.user, members, function (code, actR) {
					if (code == 201) {
						req.flash('info', 'You are now registered to this activity !');
						res.redirect('/activity');
					}
					else if (code == 304) {
						req.flash('error', 'You are already registered to this activity !');
						res.redirect('/activity');
					}
					else {
						res.status(code).send(actR);
					}
				});
			}
		});
	}
	else
		res.redirect('/activity');
});

module.exports = router;
