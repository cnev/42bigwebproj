var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var Activity = keystone.list('Activity');
var ActReg = keystone.list('ActivityRegistration');
var Corection = keystone.list('Corection');
var ForCat = keystone.list('ForumCategory');
var ForPost = keystone.list('ForumPost');
var ForThr = keystone.list('ForumThread');
var Module = keystone.list('Module');
var ModReg = keystone.list('ModuleRegistration');
var Notation = keystone.list('Notation');
var NotElem = keystone.list('NotationElement');
var ProjGrp = keystone.list('ProjectGroup');
var Ticket = keystone.list('Ticket');
var TktCat = keystone.list('TicketCategory');
var User = keystone.list('User');

var IncursiveDriver = function () {};

IncursiveDriver.prototype.delNotByAct = function(first_argument) {
	// body...
};

IncursiveDriver.prototype.delActReg = function(arid, nb, cb) {
	// body...
	ActReg.model.findById(arid).exec(function (err, actreg) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!actreg) {
			cb(404, 'ActivityRegistration Not Found');
		}
		else {
			actreg.remove(function (err) {
				if (err) {
					console.error(err);
					cb(500, err);
				}
				else {
					cb(200, 'ActivityRegistration deleted');
				}
			});
		}
	})
};

IncursiveDriver.prototype.delActRgByAct = function(act, cb) {
	// body...
	ActReg.model.find().where('activity', act).exec(function (err, actregs) {
		var i;
		var faildel = [];
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!actregs || !actregs.length) {
			cb(200, 'Nothing to do');
		}
		else {
			for (i = 0 ; i < actregs.length ; i++) {
				that.delActReg(actregs[i]._id, (i + 1), function (code, ret, nb) {
					if (code != 200) {
						faildel.push(ret);
					}
					if (nb == actregs.length) {
						console.error(faildel);
						cb(200, 'ActivityRegistrations deleted');
					}
				})
			}
		}
	})
};

IncursiveDriver.prototype.delActivity = function (name, cb) {
	// body...
	var that = this;
	Activity.model.findOne({'name':name, 'deleted':false}).exec(function (err, activity) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!activity) {
			cb(404, 'Activity Not Found');
		}
		else {
			that.delActRgByAct(activity._id, function (code1, c1err) {
				if (code1 != 200) {
					cb(code1, c1err);
				}
				else {
					that.delNotByAct(activity._id, function (code2, c2err) {
						if (code2 != 200) {
							cb(code2, c2err);
						}
						else {
							activity.remove(function (err) {
								if (err) {
									console.error(err);
									cb(500, err);
								}
								else {
									cb(200, 'Activity deleted');
								}
							});
						}
					});
				}
			});
		}
	});
};

IncursiveDriver.prototype.delActByMod = function(modId, cb) {
	// body...
	var that = this;
	Activity.model.find().where('module', modId).exec(function (err, activities) {
		var i;
		var faildel = [];
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!activities || !activities.length) {
			cb(200, 'Nothing to do');
		}
		else {
			for (i = 0 ; i < activities.length ; i++) {
				that.delActivity(activities[i].name, (i + 1), function (code, ret, nb) {
					if (code != 200) {
						faildel.push(ret);
					}
					if (nb == activities.length) {
						console.error(faildel);
						cb(200, 'Activities deleted');
					}
				});
			}
		}
	});
};

IncursiveDriver.prototype.delModReg = function (mrid, nb, cb) {
	// body...
	ModReg.model.findById(mrid).exec(function (err, modReg) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!modReg) {
			cb(404, 'ModuleRegistration Not Found');
		}
		else {
			modReg.remove(function (err) {
				if (err) {
					console.error(err);
					cb(500, err);
				}
				else {
					cb(200, 'ModuleRegistration deleted');
				}
			});
		}
	});
};

IncursiveDriver.prototype.delModRegByMod = function (modId, cb) {
	// body...
	var that = this;
	ModReg.model.find().where('module', modId).exec(function (err, modList) {
		var i;
		var faildel = [];
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!modList || !modList.length) {
			cb(200, 'Nothing to do');
		}
		else {
			for (i = 0 ; i < modList.length ; i++) {
				that.delModReg(modList[i]._id, (i + 1), function (code, ret, nb) {
					if (code != 200) {
						faildel.push(ret);
					}
					if (nb == modList.length) {
						console.error(faildel);
						cb(200, 'ModuleRegistration deleted');
					}
				});
			}
		}
	});
};

IncursiveDriver.prototype.delModule = function (name, cb) {
	// body...
	var that = this;
	Module.model.findOne({'name':name}).exec(function (err, module) {
		if (err) {
			console.error(err);
			cb(500, err);
		}
		else if (!module) {
			cb(404, 'Module Not Found');
		}
		else {
			// delForCatByMod
			that.delModRegByMod(module._id, function (code1, c1err) {
				if (code1 != 200) {
					cb(code1, c1err);
				}
				else {
					that.delActByMod(module._id, function (code2, c2err) {
						if (code2 != 200) {
							cb(code2, c2err);
						}
						else {
							module.remove(function (err) {
								if (err) {
									console.error(err);
									cb(500, err);
								}
								else {
									cb(200, 'Module deleted');
								}
							});
						}
					});
				}
			});
		}
	});
};