var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();
var User = keystone.list('User');

function functionLambda(q_res, req, res) {

}

router.get('/', function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var sess = req.session;

	var q = User.model.findOne({'uid': sess.user})
		.exec(function (err, q_res){
		if (err)
			res.status(500).send(err);
		else if (!q_res)
			res.status(404).send('not found');
		else {
			locals.data = {
				firstname: q_res.name.first,
				lastname: q_res.name.last
				//pic: '',
				//credits_owned: functionLambda(q_res, req, res)
				//credits_max:
			};
			//view.render('index');
		}
	});
});

module.exports = router;
