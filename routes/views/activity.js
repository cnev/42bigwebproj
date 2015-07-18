var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var Activity = keystone.list('Activity');

var router = express.Router();

router.get('/view/:name', function (req, res) {
	console.log(req.params.name);
	var q = Activity.model.findOne({'name': req.params.name})
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

module.exports = router;
