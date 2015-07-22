var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var Activity = keystone.list('Activity');
var Module = keystone.list('Module');

var router = express.Router();

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
					var q2 = Module.model.findOne()
						.exec(function (err, q2_res)
					{
						if (err)
							es.status(500).send('internal error');
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

module.exports = router;
