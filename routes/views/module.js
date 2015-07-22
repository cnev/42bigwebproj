var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();
var Module = keystone.list('Module');
var Module_Registration = keystone.list('Module_Registration');

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
			else if (!result)
				res.status(404).send('NOPE');
			else
			{
				for (var i = 0; i < q_res.length; i++)
					locals.data.modules.push(q_res[i]);
				//view_render('module_overview');
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
	var view = new keystone.View(req, res);
	console.log(req.params.name);
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
					var q2 = Module_Registration.model.findOne({'user.name': req.session.user})
						.where('module.name', req.params.name)
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
								res.status(500).send('already registered');
								//view.render('already_registered');
							}
						})
				}
			});
});

router.post('/register/:name', function (req, res) {
	console.log(req.body);
	if (!req.body || !req.body.answer)
		res.status(500).send('httpshitstorm');
	else if (req.body.answer == 'yes')
		res.status(200).send('YES');
	else
		res.status(200).send('NO');

});

module.exports = router;
