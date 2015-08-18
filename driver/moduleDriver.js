var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var Module = keystone.list('Module');

var ModuleDriver = function () {};

ModuleDriver.prototype.getModules = function (cb) {
	// body...
	Module.model.find().exec(function (err, modules) {
		// body...
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!modules || !modules.length) {
			cb(404, 'Modules Not Found');
		}
		else {
			cb(200, modules);
		}
	});
};

ModuleDriver.prototype.getById = function (mid, cb) {
	// body...
	Module.model.findById(mid).exec(function (err, module) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!module) {
			cb(404, 'Module Not Found');
		}
		else {
			cb(200, module);
		}
	});
};

ModuleDriver.prototype.getByName = function (name, cb) {
	// body...
	Module.model.findOne({'name':name}).exec(function (err, module) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!module) {
			cb(404, 'Module Not Found');
		}
		else {
			cb(200, module);
		}
	});
};

ModuleDriver.prototype.create = function (data, cb) {
	// body...
	var that = this;
	that.getOne(data.name, function (code, ret) {
		if (code == 500) {
			cb(code, ret);
		}
		else if (code != 404) {
			cb(403, 'This module already exist, you cannot create it twice. Try to update it instead.');
		}
		else {
			var add_q = new Module.model({
				name: data.name,
				description: data.description,
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
				credits: data.credits
			});
			add_q.save(function (err, q_saved){
				if (err){
					console.error(err);
					cb(500, err);
				}
				else {
					cb(201, data.name+' was successfully added to the module list !');
				}
			});
		}
	});
};

ModuleDriver.prototype.update = function (module, data, cb) {
	// body...
	var that = this;
	that.getOne()
};

exports.ModuleDriver = ModuleDriver;
