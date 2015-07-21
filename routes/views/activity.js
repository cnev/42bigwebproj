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
					res.locals.result = result;
					var view = new keystone.View(req, res);
					view.render('view_activity');
				}
			});
});

module.exports = router;
