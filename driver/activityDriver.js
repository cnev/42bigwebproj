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

ActivityDriver.prototype.getUserAct = function(user, cb) {
	// body...
	var that = this;
	that.getActivities(function (err, actList) {
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

ActivityDriver.prototype.getPastAct = function(cb) {
	// body...
};

ActivityDriver.prototype.getNextAtc = function(cb) {
	// body...
};

ActivityDriver.prototype.getModuleAct = function(module, cb) {
	// body...
};

exports.ActivityDriver = ActivityDriver;