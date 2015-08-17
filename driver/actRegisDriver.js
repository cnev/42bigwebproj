var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var ActRegis = keystone.list('ActivityRegistration');
var Activity = keystone.list('Activity');
var User = keystone.list('User');

var ActRegisDriver = function () {};

ActRegisDriver.prototype.getActivities = function (user, cb) {
	// body...
	ActRegis.model.find().where({'user': user, 'encours': true}).exec(function (err, actRList) {
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
	ActRegis.model.findOne({'user': user, 'activity': activity}).exec(function (err, actR) {
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

ActRegisDriver.prototype.register = function (activity, user, cb) {
	// body...
	var that = this;
	that.getOneActivity(activity, user, function (code, actR) {
		if (code == 500) {
			cb(code, actR);
		}
		else if (code == 200) {
			cb(304, actR);
		}
		else {
			var newActR = new ActRegis.model({
				user: user,
				activity: activity,
				encours: true
			});
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
};


/*if (model_q_res.registration.ends.getTime() < now.getTime()) {
	req.flash('error', 'Registrations are over, you cannot register to this activity anymore !');
	res.redirect('/activity/view/'+req.params.name);
}*/

ActRegisDriver.prototype.preRegister = function(activity, user, cb) {
	// body...
	var that = this;
	User.findOne({'uid':user}).exec(function (err, usr) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!usr) {
			cb(404, 'User Not Found');
		}
		else {
			Activity.findOne({'name':activity}).exec(function (err, act) {
				if (err) {
					console.error(err);
					cb(500, err);
				}
				else if (!act) {
					cb(404, 'Activity Not Found');
				}
				else {
					that.register(act, usr, function (code, actR) {
						cb(code, actR);
					});
				}
			});
		}
	});
};

exports.ActRegisDriver = ActRegisDriver;