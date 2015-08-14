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
			cb(err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(1);
		}
		else {
			cb(null, actList);
		}
	});
};

ActivityDriver.prototype.getCurrent = function(cb) {
	// body...
	Activity.model.find().where('period.begins.getTime() < now.getTime() && period.ends.getTime() > now.getTime()').exec(function (err, actList) {
		if (err) {
			console.error(err);
			cb(err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(1);
		}
		else {
			cb(null, actList);
		}
	});
};

ActivityDriver.prototype.getInscPoss = function(cb) {
	// body...
	Activity.model.find().where('registration.begins.getTime() < now.getTime() && registration.ends.getTime() > now.getTime()').exec(function (err, actList) {
		if (err) {
			console.error(err);
			cb(err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(1);
		}
		else {
			cb(null, actList);
		}
	});
};

ActivityDriver.prototype.getNextAct = function(cb) {
	// body...
	var that = this;
	Activity.model.find().where('period.begins.getTime > now.getTime() && registration.ends.getTime() < now.getTime() + 604800000 && registration.begins.getTime() > now.getTime()').exec(function (err, actList) {
		if (err) {
			console.error(err);
			cb(err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(1);
		}
		else {
			cb(null, actList);
		}
	})
};

ActivityDriver.prototype.getUserAct = function(user, cb) {
	// body...
	var that = this;
	that.getCurrent(function (err, actList) {
		if (err) {
			console.error(err);
			cb(err);
		}
		else {
			ActivityRegistration.model.find({'user':user, 'encours':true}).exec(function (err, actRList) {
				var i;
				var j;
				var actTab = [];
				if (err) {
					cb(err);
				}
				else if (!actRList) {
					console.log("no activities found");
					cb();
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
					cb(null, actTab);
				}
			});
		}
	});
};

ActivityDriver.prototype.getPastAct = function(user, cb) {
	// body...
	var that = this;
	Activity.model.find().where('period.end.getTime() < now.getTime()').exec(function (err, actList) {
		if (err) {
			console.error(err);
			cb(err);
		}
		else if (!actList || actList.length == 0) {
			console.error('C\'est completement vide ici.');
			cb(1);
		}
		else {
			ActivityRegistration.model.find({'user':user}).exec(function (err, actRList) {
				var i;
				var j;
				var actTab = [];
				if (err) {
					cb(err);
				}
				else if (!actRList) {
					console.log("no activities found");
					cb();
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
					cb(null, actTab);
				}
			});
		}
	});
};

ActivityDriver.prototype.getOne = function(name, cb) {
	// body...
};

ActivityDriver.prototype.create = function(data, cb) {
	// body...
};

exports.ActivityDriver = ActivityDriver;