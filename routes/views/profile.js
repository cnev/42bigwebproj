var express = require('express');
var session = require('express-session');
var keystone = require('keystone');

var router = express.Router();

var User = keystone.list('User');
var Module = keystone.list('Module');
var Activity = keystone.list('Activity');
var ActivityRegistration = keystone.list('ActivityRegistration');

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

function setUsrNote(uid) {
	User.model.findById(uid).exec(function (err, usr) {
		if (err) {
			console.error(err);
		}
		else if (!usr) {
			console.error('???');
		}
		else {
			console.log('qwerty - ' + uid);
		}
	});
}

function checkact (actreg) {
	Activity.model.findById(actreg.activity).exec(function (err, activity) {
		var now = new Date();
		if (err) {
			console.error(err);
		}
		else if (!activity) {
			console.error('pitisouci');
		}
		else {
			if (activity.period.ends.getTime() < now.getTime()) {
				actreg.encours = false;
				actreg.save(function (err) {
					if (err) {
						console.error(err);
					}
					else {
						setUsrNote(actreg.user);
					}
				})
			}
		}
	});
}

function getInActivity(uid, cb) {
	ActivityRegistration.model.find({'user':uid, 'encours':true}).exec(function (err, actList) {
		var i;
		if (err) {
			cb(err);
		}
		else {
			for (i = 0 ; i < actList.length ; i++) {
				checkact(actList[i]);
			}
			ActivityRegistration.model.find({'user':uid, 'encours':true}).exec(function (err, actInList) {
				if (err) {
					cb(err);
				}
				else {
					cb(null, actInList);
				}
			});
		}
	});
}

function getActivitys (uid, cb) {
	getInActivity(uid, function (err, actInList) {
		var now = new Date();
		if (err) {
			cb(err);
		}
		else {
			Activity.model.find().where('period.begin.getTime() < now.getTime && period.ends.getTime > now.getTime()').exec(function (err, actList) {
				var i;
				var j;
				var Activitys = [];
				if (err) {
					cb(err);
				}
				else {
					/*for (i = 0 ; i < actList.length ; i++) {
						if (period.begin.getTime() < now.getTime && period.ends.getTime > now.getTime())
					}*/
					for (i = 0 ; i < actInList.length ; i++) {
						for (j = 0 ; j < actList.length ; i++) {
							if (toString(actList[j]._id) != toString(actInList[i].activity)) {
								Activitys.push(actList[i]);
							}
						}
					}
					cb(null, Activitys, actInList);
				}
			})
		}
	})
}

router.get('/', function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var sess = req.session;

	User.model.findOne({'uid': sess.user})
		.exec(function (err, q_res){
		if (err)
			res.status(500).send(err);
		else if (!q_res)
			res.status(404).send('not found');
		else {
			getActivitys(q_res._id, function (err, actList, actInList) {
				if (err) {
					console.error(err);
					res.status(500).send(err);
				}
				else {

					locals.data = {
						firstname: q_res.name.first,
						lastname: q_res.name.last,
						cred_a: 20,//function
						cred_p: 50,//function
						mod: fetchModules(q_res, req, res),
						act_insc: actInList,
						act_disp : actList
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
			})
		}
	});
});

module.exports = router;
