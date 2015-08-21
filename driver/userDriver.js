var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;
var passhash = require('password-hash');

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

UserDriver.prototype.create = function (logger, pass, cb) {
	// body...
	var newUser = new User.model({
		name: { first: logger.givenName, last: logger.sn },
		uid: logger.uid,
		password: passhash.generate(pass, {'algorithm':'whirlpool', 'saltLength':16, 'iteration':3}),
		email: logger.alias[0],
		uidNumber: logger.uidNumber,
		gidNumber: logger.gidNumber
	});
	newUser.save(function (err, usrsaved) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else {
			cb(201, usrsaved);
		}
	});
};

UserDriver.prototype.toLog = function (logger, pass, cb) {
	// body...
	var that = this;
	that.getByUid(logger.uid, function (code1, user) {
		if (code1 == 404) {
			that.create(logger, pass, function (code2, usrc) {
				cb(code2, usrc)
			});
		}
		else {
			cb(code1, user);
		}
	});
};

UserDriver.prototype.getUsers = function (uidTab, cb) {
	// body...
	var that = this;
	var i;
	var got = [];
	var failGet = [];
	for (i = 0 ; i < uidTab.length ; i++) {
		that.getByUid(uidTab[i], function (code, ret) {
			if (code != 200) {
				failGet.push(ret);
			}
			else {
				got.push(ret);
			}
			if ((got.length + failGet.length) == uidTab.length) {
				console.error(failGet);
				cb(200, got);
			}
		});
	}
};

exports.UserDriver = UserDriver;
