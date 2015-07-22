var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();
var Module = keystone.list('Module');

router.get('/', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.data = {
		modules: [];
	};
	var q = Module.model.find()
		.sort('name')
		.exec(function (err, q_res)) {
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
		}
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
