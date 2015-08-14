var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var Activity = keystone.list('Activity');
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
	var q = Activity.model.find()
		.sort('name')
		.exec(function (err, q_res) {
			if (err)
				res.status(500).send('internal error');
			else if (!q_res)
				res.status(404).send('NOPE');
			else
			{
				for (var i = 0; i < q_res.length; i++)
					locals.data.activities.push(q_res[i]);
					locals.data.path = req.route.path;
				view.render('activity_overview');
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
	var q = Activity.model.findOne({'name': req.params.name})
			.exec(function(err, q_res) {
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
								test = "<form action='/activity/register/" + req.params.name + "' method='POST'>";
								test += "<ul>";
								test += "<li><input type='submit' name='answer' value='yes'></li>";
								test += "<li><input type='submit' name='answer' value='no'></li>";
								test += "</ul>";
								res.status(200).send(test);
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
		var search_user, search_model;
			var user_q = User.model.findOne({'uid': req.session.user})
			.exec(function (err, user_q_res) {
				search_user = user_q_res._id;
				var model_q = Activity.model.findOne({'name': req.params.name})
				.exec(function (err, model_q_res) {
					search_model = model_q_res._id;
					var q2 = ActivityRegistration.model.findOne({'user': search_user})
					.where('activity', search_model)
					.exec(function (err, q2_res) {
						if (err)
							res.status(500).send(err);
						else if (!q2_res)
						{
							var add_q = new ActivityRegistration.model({
								user: search_user,
								activity: search_model,
								encours: true
							});
							add_q.save(function (err, saved){
								req.flash('info', 'You are now registered to this activity !');
								res.redirect('/activity');
							});
						}
						else
						{
							req.flash('error', 'You are already registered to this activity !');
							res.redirect('/activity');
						}
					});
				});
			});
	}
	else
		res.redirect('/activity');
});

module.exports = router;
