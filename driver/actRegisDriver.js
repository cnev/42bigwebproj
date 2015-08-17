var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var ActRegis = keystone.list('ActivityRegistration');

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
			cb(null, actRList);
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
			cb(null, actR);
		}
	});
};

ActRegisDriver.prototype.register = function (data, cb) {
	// body...
};

exports.ActRegisDriver = ActRegisDriver;