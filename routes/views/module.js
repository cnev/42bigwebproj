var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();
var Module = keystone.list('Module');

router.get('/', function (req, res) {
	var view = new keystone.View(req, res);

	//view_render('module_overview');
});

router.get('/view/:name', function (req, res) {

	var q = Module.model.findOne({'name': req.params.name})
			.exec(function(err, result) {
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
