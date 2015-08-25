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

function validateUser(activity, members, i, cb) {
	console.log('member: '+i);
	console.log(members[i]);
	ActRegis.model.findOne()
	.where('activity', activity)
	.where('members').in([members[i]])
	.exec(function (code, actR) {
		if (code == 500) {
			console.log('PAF');
			cb(code, i, "ERROR");
		}
		else if (code == 404) {
			console.log("PORO");
			cb(200, i, "OK");
		}
		else {
			console.log('KNIFE');
			cb(409, i, 'One or more members already is/are registered to this activity.');
		}
	});
}

ActRegisDriver.prototype.validateGroup = function(activity, members, cb) {
	var that = this;
	var tmp;
	var ok = true;
	for (var i = 0 ; i < members.length; i++) {
		validateUser(activity, members, i, function (code, i, actR){
			if (code == 500 || code == 409) {
				ok = false;
			}
			if (i == members.length - 1) {
				if (ok) {
					cb(200, null);
				} else {
					cb(code, actR);
				}
			}
		});
	}
};
/*
that.getOneActivity(activity, owner, function (code, ret) {
		var i;
		var got = 0;
		var newActR;
		var stock = [];
		var tmp;
		if (code == 200) {
			cb(409, 'You already are registered to that activity.');
		}
		else {
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
						stock.push(members[i]);
						if (stock.length == members.length) {
							var newActR = new ActRegis.model({
								owner: owner,
								members: stock,
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
					}
					if (got == -1) {
						return ;
					}
				});
			}
		}
	});*/
ActRegisDriver.prototype.register = function (activity, owner, members, cb) {
	// body...
	var that = this;
	//console.log(members);
	that.validateGroup(activity, members, function (code, actR){
		console.log('postvalidate');
		if (code == 500)
			cb(500, 'REGISTRATION ERROR');
		else if (code == 409) {
			cb(409, actR);
		}
		else if (code == 200) {
			console.log("PANDA");
			var newActR = new ActRegis.model({
				owner: owner,
				members: members,
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
	})
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
					console.log('WABBIT');
					that.register(act, usr, members, function (code, actR) {
						cb(code, actR);
					});
				}
			});
		}
	});
};

ActRegisDriver.prototype.getGroupsByActivity = function (activity, cb) {
	var that = this;
	ActivityRegistration.model.find()
	.where('activity', activity)
	.exec(function (err, groups){
		if (err)
			cb(500, err);
		else if (groups.length == 0) {
			cb(404, 'no group found for this activity');
		} else {
			cb(200, groups);
		}
	});
};

ActRegisDriver.prototype.getUsersByActivity = function (activity, cb) {
	var that = this;

	that.getGroupsByActivity(activity, function (code, groups){
		if (code == 500 || code == 404) {
			cb(code, groups);
		} else {

		}
	});
};

exports.ActRegisDriver = ActRegisDriver;
