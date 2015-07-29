var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();
var Module = keystone.list('Module');
var User = keystone.list('User');
var ModuleRegistration = keystone.list('ModuleRegistration');
/*
function findUser (req, res, uid) {
	var q = User.model.findOne({'uid': uid})
		.exec(function (err, q_res) {
			console.log(q_res.ObjectId);
			return(q_res.ObjectId);
		});
}

function findModule (req, res, name) {
	var q = Module.model.findOne({'name': name})
		.exec(function (err, q_res) {
			console.log(q_res.ObjectId);
			return(q_res.ObjectId);
		});
}*/

router.get('/', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.data = {
		modules: []
	};
	var q = Module.model.find()
	.sort('name')
	.exec(function (err, q_res) {
		if (err)
			res.status(500).send('internal error');
		else if (!q_res)
			res.status(404).send('NOPE');
		else
		{
			for (var i = 0; i < q_res.length; i++)
				locals.data.modules.push(q_res[i]);
				view.render('module_overview');
			}
		});
});

router.get('/view/:name', function (req, res) {

	var q = Module.model.findOne({'name': req.params.name})
	.exec(function (err, result) {
		if (err)
		{
			res.status(500).send('internal error');
		}
		else if (!result)
		{
			res.status(404).send('NOPE');
		}
		else
		{
			var print = '';
			print += '<div>';
			print += '<p>'+result.name+'</p>';
			print += '<p>'+result.description+'</p>';
			print += '<p>'+result.slots.max+'</p>';
			print += '<p>'+result.slots.current+'</p>';
			print += '</div>';
			res.status(200).send(print);
		}
	});
});

router.get('/register/:name', function (req, res) {
	console.log('route: '+req.route.path);
	var view = new keystone.View(req, res);
	console.log(req.params.name);
	var q = Module.model.findOne({'name': req.params.name})
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
				var model_q = Module.model.findOne({'name': req.params.name})
				.exec(function (err, model_q_res) {
					search_model = model_q_res._id;
					var q2 = ModuleRegistration.model.findOne({'user': search_user})
					.where('module', search_model)
					.exec(function (err, q2_res) {
						if (err)
							res.status(500).send(err);
						else if (!q2_res)
						{
							test = "<form action='/module/register/" + req.params.name + "' method='POST'>";
							test += "<ul>";
							test += "<li><input type='submit' name='answer' value='yes'></li>";
							test += "<li><input type='submit' name='answer' value='no'></li>";
							test += "</ul>";
							res.status(200).send(test);
							//view.render('confirm_registration');
						}
						else
						{
							req.flash('error', 'You are already registered to this module !');
							res.redirect('/module/view/'+req.params.name);
							//res.status(500).send('already registered');
							//view.render('already_registered');
						}
					});
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
				var model_q = Module.model.findOne({'name': req.params.name})
				.exec(function (err, model_q_res) {
					search_model = model_q_res._id;
					var q2 = ModuleRegistration.model.findOne({'user': search_user})
					.where('module', search_model)
					.exec(function (err, q2_res) {
						if (err)
							res.status(500).send(err);
						else if (!q2_res)
						{
							var add_q = new ModuleRegistration.model({
								user: search_user,
								module: search_model,
								status: 'pending'
							});
							add_q.save();
							res.status(200).send("OK!");
							//view.render('confirm_registration');
						}
						else
						{
							res.status(500).send('already registered');
							//view.render('already_registered');
						}
					});
				});
			});
	}
	else
		res.redirect('/module');
});

module.exports = router;
