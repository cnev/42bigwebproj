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

ModuleDriver.prototype.save = function (module, cb) {
	// body...
	module.save(function (err, q_saved) {
		if (err || !q_saved) {
			console.error(err);
			cb(500, err);
		}
		else {
			cb(201, module);
		}
	})
};

ModuleDriver.prototype.create = function (data, cb) {
	// body...
	var that = this;
	that.getOne(data.name, function (code1, ret) {
		if (code1 == 500) {
			cb(code1, ret);
		}
		else if (code1 != 404) {
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
			that.save(add_q, function (code2, module) {
				if (code2 != 201) {
					cb(code2, module);
				}
				else {
					cb(code2, module.name+' was successfully added to the module list !');
				}
			});
		}
	});
};

ModuleDriver.prototype.update = function (name, data, cb) {
	// body...
	var that = this;
	var preset = {
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
	};
	Module.model.update({'name':name}, preset, {'multi':false}).exec(function (err, result) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else {
			that.getByName(data.name, function (code, module) {
				cb(code, module);
			});
		}
	});
};

exports.ModuleDriver = ModuleDriver;
