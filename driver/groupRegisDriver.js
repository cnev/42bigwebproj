var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var ActRegis = keystone.list('ActivityRegistration');
var GroupRegis = keystone.list('GroupRegistration');
var Activity = keystone.list('Activity');
var User = keystone.list('User');

var groupRegisDriver = function () {};

GroupRegisDriver.prototype.getGroupsByActivity = function (activity, cb) {
	var that = this;
	GroupRegistration.model.find()
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

exports.ActRegisDriver = ActRegisDriver;
