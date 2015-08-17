var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var User = keystone.list('User');

var UserDriver = function () {};

UserDriver.prototype.getById = function (uid, cb) {
	// body...
	User.model.findById(uid).exec(function (err, user) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!user) {
			cb(404, 'User Not Found');
		}
		else {
			cb(200, usr);
		}
	});
};

UserDriver.prototype.getByUid = function (uid, cb) {
	// body...
	User.model.findOne({'uid': uid}).exec(function (err, user) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!user) {
			cb(404, 'User Not Found');
		}
		else {
			cb(200, user);
		}
	});
};

UserDriver.prototype.create = function (data, cb) {
	// body...
};

exports.UserDriver = UserDriver;