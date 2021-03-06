var express = require('express');
var session = require('express-session');
var keystone = require('keystone');

var ActDriv = require('../../driver/activityDriver').ActivityDriver;
var UsrDrv = require('../../driver/userDriver').UserDriver;
var ActivityDriver = new ActDriv ();
var UserDriver = new UsrDrv ();

var router = express.Router();

var User = keystone.list('User');
var Module = keystone.list('Module');
var Activity = keystone.list('Activity');
var ActivityRegistration = keystone.list('ActivityRegistration');

function fetch_modules(user, req, res, cb) {

	var q = Module.model.find()
		.exec(function (err, q_res){
			if (err)
				cb(1);
			else if (!res)
				cb(null, null);
			else {
				if (q_res.length == 0)
					cb(null, null);
				else
				{
					var tab = [];
					for (var i = 0; i < q_res.length; i++){
						tab.push(q_res[i]);
					if (i == q_res.length - 1)
						cb(null, tab);
					}
				}
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

/*function getInActivity(uid, cb) {
  ActivityRegistration.model.find({'encours':true}).where({'user':uid}).exec(function (err, actList) {
  var i;
  if (err) {
  console.error(err);
  cb(err);
  }
  else {
  console.log(actList);
  for (i = 0 ; i < actList.length ; i++) {
  checkact(actList[i]);
  }
  ActivityRegistration.model.find({'encours':true}).where({'user':uid}).exec(function (err, actInList) {
  if (err) {
  console.error(err);
  cb(err);
  }
  else {
  console.log('qwerty');
  console.log(actInList);
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
  Activity.model.find().where('period.begin.getTime() < now.getTime() && period.ends.getTime() > now.getTime()').exec(function (err, actList) {
  var i;
  var j;
  var check;
  var Activities = [];
  if (err) {
  console.error(err);
  cb(err);
  }
  else {
  console.log(actList);
  console.log(actInList);
/*for (i = 0 ; i < actList.length ; i++) {
if (period.begin.getTime() < now.getTime && period.ends.getTime > now.getTime())
}* /
for (i = 0 ; i < actList.length ; i++) {
check = false;
for (j = 0 ; j < actInList.length ; j++) {
if (toString(actList[i]._id) == toString(actInList[j].activity)) {
console.log((check = true));
}
}
if (!check) {
Activities.push(actList[i]);
}
}
cb(null, Activities, actInList);
}
});
}
});
}*/

function getActivities (user, cb) {
	Activity.model.find().where('period.begin.getTime() < now.getTime() + 604800000').exec(function (err, actList) {
		if (err) {
			cb(err);
		}
		else if (!actList) {
			console.log("no activities found");
			cb(null, null, null);
		}
		else {
			ActivityRegistration.model.find()
			.where('user', user)
			.where('encours', true)
			.exec(function (err, q_register) {
				if (err) {
					cb(err);
				}
				else if (!q_register) {
					console.log("no registrations found");
					cb(null, actList, null);
				}
				else {
					if (q_register.length == 0)
						cb(null, actList, null);
					else
					{
						var actInList = [];
						for (var i = 0; i < q_register.length; i++) {
							Activity.model.findById(q_register[i].activity)
								.exec(function (err, q_activity){
								actInList.push(q_activity);
							});
							if (i == q_register.length - 1)
								cb(null, actList, actInList);
						}
					}

				}
			});
		}
	});
}

function fetch_name(user, cb){
	var named = user.name;
	cb(null, named);
}

function fetch_credits(cb){
	var credited = {
		a: 20,
		p: 50
	};
	cb(null, credited);
}

function fetch_data(q_res, req, res, actInList, actList, cb)
{
	var data =
	{
		firstname: null,
		lastname: null,
		cred_a: null,
		cred_p: null,
		mod: null,
		actInList: actInList,
		actList: actList
		//pastActList,
		//nextActlist

			/*
			   firstname: q_res.name.first,
			   lastname: q_res.name.last,
			   cred_a: 20,//function
			   cred_p: 50,//function
			   mod: fetchModules(q_res, req, res),
			   actInList: actInList,
			   actList: actList
			//act_past
			//act_go
			//to_correct
			//corrected_by
			//picture: '',
			//credits_owned: functionLambda(q_res, req, res)
			//credits_max:*/
	};
	fetch_name(q_res, function(err, named){
		data.name = named;
		fetch_credits(function(err, credited){
			data.cred_a = credited.a;
			data.cred_p = credited.p;
			fetch_modules(q_res, req, res, function(err, moduled){
				data.mod = moduled;
				cb(null, data);
			});
		});
	});
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
			if (sess.isAdmin)
				view.render('index');
			else
			{
				console.log('getting activities');
				ActivityDriver.getUserAct (q_res, function (err, actInList) {
					if (err == 500) {
						console.error('MyError1 ' + actInList);
						res.status(err).send(actInList);
					}
					else {
						ActivityDriver.getPastAct(q_res, function (err, actPList) {
							if (err == 500) {
								console.error('MyError2' + err);
								res.status(err).send(actPList)
							}
							else {
								fetch_data(q_res, req, res, actInList, actPList, function(err, fetched) {
									locals.data = fetched;
									view.render('index');
								});
							}
						});
					}
				});
			}
		}
	});
});

router.get('/autologin', function (req, res) {
	UserDriver.getByUid(req.session.user, function (code, user) {
		if (code == 500) {
			console.error('Error authenticating user. Exiting ...');
			res.redirect('/logout');
		} else {
			var str = Math.random().toString(36)+Math.random().toString(36)+Math.random().toString(36)+Math.random().toString(36);
			User.model.find()
			.where('autologin', str)
			.exec(function (err, ret){
				if (err) {
					res.status(500).send('/profile/autologin error');
				} else if (ret.length != 0) {
					req.flash('error', '/profile/autologin error');
					res.redirect('/profile');
				} else {
					user.autologin = str;
					user.save(function (err, q_saved){

						req.flash('info', 'autologin (re)generated : '+str);
						res.redirect('/profile');
					});
				}
			});
		}
	})
})

module.exports = router;
