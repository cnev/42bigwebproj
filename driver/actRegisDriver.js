var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var ActRegis = keystone.list('ActivityRegistration');

var ActRegisDriver = function () {};

ActRegisDriver.prototype.getActivities = function (f_data, w_data, i_data, cb) {
	// body...
	if (w_data && i_data) {
		ActRegis.model.find(f_data).where(w_data).in(i_data).exec(function (err, actRList) {
			if (err) {
				console.error(err);
				cb(err);
			}
			else if (!actRList || actRList.length == 0) {
				console.error('C\'est completement vide ici.');
				cb(1);
			}
			else {
				cb(null, actRList);
			}
		});
	}
	else if (i_data) {
		cb('"where" not set, cannot use "in"');
	}
	else {
		ActRegis.model.find(f_data).where(w_data).exec(function (err, actRList) {
			if (err) {
				console.error(err);
				cb(err);
			}
			else if (!actRList || actRList.length == 0) {
				console.error('C\'est completement vide ici.');
				cb(1);
			}
			else {
				cb(null, actRList);
			}
		});
	}
};

ActRegisDriver.prototype.getOneActivity = function(activity, user, cb) {
	// body...
};

exports.ActRegisDriver = ActRegisDriver;