var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var ActRegis = keystone.list('ActivityRegistration');
var Activity = keystone.list('Activity');
var User = keystone.list('User');

var ActRegisDriver = function () {};

ActRegisDriver.prototype.getActivities = function (user, cb) {
	// body...
	ActRegis.model.find().where({'encours': true})
	.where('members').in([user])
	.exec(function (err, actRList) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!actRList || actRList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(404, 'No activities found for user ' + user);
		}
		else {
			cb(200, actRList);
		}
	});
};

ActRegisDriver.prototype.getOneActivity = function (activity, user, cb) {
	// body...
	ActRegis.model.findOne({'activity': activity})
	.where('members').in([user])
	.exec(function (err, actR) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!actR) {
			console.error('C\'est completement vide ici.');
			cb(404, 'No such activity found for user ' + user);
		}
		else {
			cb(200, actR);
		}
	});
};

ActRegisDriver.prototype.register = function (activity, owner, members, cb) {
	// body...
	var that = this;
	that.getOneActivity(activity, owner, function (code, ret) {
		var i;
		var got = 0;
		if (code == 200) {
			cb(409, 'You already are registered to that activity.');
		}
		else {
			var newActR = new ActRegis.model({
				owner: owner,
				activity: activity,
				encours: true
			});
			for (i = 0 ; i < members.length ; i++) {
				that.getOneActivity(activity, members[i], function (code, actR) {
					if (code == 500) {
						cb(code, actR);
						got = -1;
					}
					else if (code == 200) {
						cb(409, 'One or more members already is/are registered to this activity.');
						got = -1;
					}
					else {
						newActR.members.push(members[i]);
					}
					if (got == -1) {
						return ;
					}
					else if (newActR.members.length == members.length) {
						newActR.save(function (err, cActR) {
							if (err) {
								console.error(err);
								cb(500, err);
							}
							else {
								cb(201, cActR);
							}
						});
					}
				});
			}
		}
	});
};

/*if (model_q_res.registration.ends.getTime() < now.getTime()) {
	req.flash('error', 'Registrations are over, you cannot register to this activity anymore !');
	res.redirect('/activity/view/'+req.params.name);
}*/

ActRegisDriver.prototype.preRegister = function(activity, owner_uid, members, cb) {
	// body...
	var that = this;
	User.model.findOne({'uid':owner_uid}).exec(function (err, usr) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!usr) {
			cb(404, 'User Not Found');
		}
		else {
			Activity.model.findOne({'name':activity}).exec(function (err, act) {
				if (err) {
					console.error(err);
					cb(500, err);
				}
				else if (!act) {
					cb(404, 'Activity Not Found');
				}
				else {
					that.register(act, usr, members, function (code, actR) {
						cb(code, actR);
					});
				}
			});
		}
	});
};

exports.ActRegisDriver = ActRegisDriver;
