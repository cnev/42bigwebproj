var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();
var User = keystone.list('User');
var Module = keystone.list('Module');

function fetchModules(user, req, res) {

	var q = Module.model.find()
		.exec(function (err, q_res){
			if (err)
				res.status(500).send(err);
			else if (!res)
				res.status(404).send('not found');
			else {
				var tab = [];
				for (var i = 0; i < q_res.length; i++)
					tab.push(q_res[i]);
				return (tab);
			}
		});
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
				lastname: q_res.name.last,
				cred_a: 20,//function
				cred_p: 50,//function
				mod: fetchModules(q_res, req, res)
				//act_insc
				//act_disp
				//act_past
				//act_go
				//to_correct
				//corrected_by
				//picture: '',
				//credits_owned: functionLambda(q_res, req, res)
				//credits_max:
			};
			view.render('index');
		}
	});
});

module.exports = router;
