var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var Activity = keystone.list('Activity');
var ActivityRegistration = keystone.list('ActivityRegistration');

var ActivityDriver = function () {};

ActivityDriver.prototype.getActivities = function (cb) {
	// body...
	Activity.model.find().exec(function (err, actList) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(404, 'activity(ies) not found');
		}
		else {
			cb(200, actList);
		}
	});
};

ActivityDriver.prototype.getCurrent = function (cb) {
	// body...
	Activity.model.find().where('period.begins.getTime() < now.getTime() && period.ends.getTime() > now.getTime()').exec(function (err, actList) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(404, 'activity(ies) not found');
		}
		else {
			cb(200, actList);
		}
	});
};

ActivityDriver.prototype.getInscPoss = function (cb) {
	// body...
	Activity.model.find().where('registration.begins.getTime() < now.getTime() && registration.ends.getTime() > now.getTime()').exec(function (err, actList) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(404, 'activity(ies) not found');
		}
		else {
			cb(200, actList);
		}
	});
};

ActivityDriver.prototype.getNextAct = function (cb) {
	// body...
	Activity.model.find().where('period.begins.getTime > now.getTime() && registration.ends.getTime() < now.getTime() + 604800000 && registration.begins.getTime() > now.getTime()').exec(function (err, actList) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(404, 'activity(ies) not found');
		}
		else {
			cb(200, actList);
		}
	})
};

ActivityDriver.prototype.getUserAct = function (user, cb) {
	// body...
	var that = this;
	that.getCurrent(function (code, actList) {
		if (code != 200) {
			cb(code, actList);
		}
		else {
			ActivityRegistration.model.find({'user':user, 'encours':true}).exec(function (err, actRList) {
				var i;
				var j;
				var actTab = [];
				if (err) {
					cb(500, err);
				}
				else if (!actRList) {
					console.log('No activities found');
					cb(404, 'No Activities Found');
				}
				else {
					console.log(actRList);
					for (i = 0 ; i < actRList.length ; i++) {
						for (j = 0 ; j < actList.length ; j++) {
							if (actRList[i].activity.toString() == actList[j]._id.toString())
								actTab.push(actList[j]);
						}
					}
					console.log(actTab);
					cb(202, actTab);
				}
			});
		}
	});
};

ActivityDriver.prototype.getPastAct = function (user, cb) {
	// body...
	Activity.model.find().where('period.end.getTime() < now.getTime()').exec(function (err, actList) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(404, 'activity(ies) not found');
		}
		else {
			ActivityRegistration.model.find({'user':user}).exec(function (err, actRList) {
				var i;
				var j;
				var actTab = [];
				if (err) {
					cb(500, err);
				}
				else if (!actRList) {
					console.log('No activities found');
					cb(404, 'No activities found');
				}
				else {
					console.log(actRList);
					for (i = 0 ; i < actRList.length ; i++) {
						for (j = 0 ; j < actList.length ; j++) {
							if (actRList[i].activity.toString() == actList[j]._id.toString())
								actTab.push(actList[j]);
						}
					}
					console.log(actTab);
					cb(202, actTab);
				}
			});
		}
	});
};

ActivityDriver.prototype.getOne = function (name, cb) {
	// body...
	Activity.model.findOne({'name':name}).exec(function (err, activity) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!activity) {
			console.error('C\'est completement vide ici.');
			cb(404, 'activity not found');
		}
		else {
			cb(200, activity);
		}
	});
};

ActivityDriver.prototype.create = function (data, cb) {
	// body...
	var add_q = new Activity.model({
		name: data.name,
		description: data.description,
		subject: data.subject,
		slots: {
			max: data.slots,
			current: 0
		},
		registration: {
			begins: new Date(data.registrationbegins),
			ends: new Date(data.registrationends)
		},
		period: {
			begins: new Date(data.periodbegins),
			ends: new Date(data.periodends)
		},
		req_corrections: data.reqcorrections,
		auto_group: data.autogroup,
		module: data.module,
		type: data.type
	});
	add_q.save(function (err, q_saved) {
		if (err) {
			console.log("FAIL !");
			console.error(err);
			cb(500, err);
		}
		else {
			console.log(q_saved);
			cb(201, data.name + ' was successfully added to the activity list !');
		}
	});
};

exports.ActivityDriver = ActivityDriver;