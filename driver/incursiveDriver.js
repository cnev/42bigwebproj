var keystone = require('keystone');
var ObjectId = require('mongodb').ObjectId;

var Activity = keystone.list('Activity');//
var ActReg = keystone.list('ActivityRegistration');//
var Corection = keystone.list('Corection');//
var ForCat = keystone.list('ForumCategory');
var ForPost = keystone.list('ForumPost');
var ForThr = keystone.list('ForumThread');
var Module = keystone.list('Module');//
var ModReg = keystone.list('ModuleRegistration');//
var Notation = keystone.list('Notation');//
var NotElem = keystone.list('NotationElement');//
var Ticket = keystone.list('Ticket');
var TktCat = keystone.list('TicketCategory');
var User = keystone.list('User'); // not to delete ... juste may need ...

var IncursiveDriver = function () {};

IncursiveDriver.prototype.delNotElem = function (neid, callback, nb) {
	// body...
	NotElem.model.findById(neid).remove(function (err) {
		if (err) {
			console.error(err);
			callback(500, err, nb);
		}
		else {
			callback(200, 'NotationElement deleted', nb);
		}
	});
};

IncursiveDriver.prototype.delNotElemTab = function (notElemTab, callback) {
	// body...
	var i;
	var tocb = [];
	var faildel = [];
	var deldone = [];
	for (i = 0 ; i < notElemTab.length ; i++) {
		that.delNotElem(notElemTab[i], function (code, ret, nb) {
			if (code != 200) {
				faildel.push(ret);
			}
			else {
				deldone.push(ret);
			}
			if (nb = notElemTab.length) {
				tocb.push(faildel);
				tocb.push(deldone);
				tocb.push('NotationElements deleted');
				callback(200, tocb);
			}
		}, (i + 1));
	}
};

IncursiveDriver.prototype.delNotation = function (nid, callback, nb) {
	// body...
	var that = this;
	var tocb = [];
	Notation.model.findById(nid).exec(function (err, notation) {
		if (err) {
			console.error(err);
			callback(500, err, nb);
		}
		else if (!notation) {
			callback(404, 'Notation Not Found', nb);
		}
		else {
			that.delNotElemTab(notation.contents, function (code, value) {
				if (code != 200) {
					callback(code, value, nb);
				}
				else {
					tocb.push(value);
					notation.remove(function (err) {
						if (err) {
							console.error(err);
							callback(500, err, nb);
						}
						else {
							tocb.push('Notation deleted');
							callback(200, tocb, nb);
						}
					});
				}
			});
		}
	});
};

IncursiveDriver.prototype.delNotByAct = function (act, callback) {
	// body...
	var that = this;
	Notation.model.find().where('activity', act).exec(function (err, notations) {
		var i;
		var faildel = [];
		var deldone = [];
		if (err) {
			console.error(err);
			callback(500, err);
		}
		else if (!actregs || !actregs.length) {
			callback(200, 'Nothing to do');
		}
		else {
			for (i = 0 ; i < actregs.length ; i++) {
				that.delNotation(notations[i]._id, function (code, ret, nb) {
					if (code != 200) {
						faildel.push(ret);
					}
					else {
						deldone.push(ret);
					}
					if (nb == notations.length) {
						tocb.push(faildel);
						tocb.push(deldone);
						tocb.push('Notations deleted');
						callback(200, tocb);
					}
				}, (i + 1));
			}
		}
	});
};

IncursiveDriver.prototype.delCorection = function (cid, callback, nb) {
	// body...
	Corection.model.findById(cid).remove(function (err) {
		if (err) {
			console.error(err);
			callback(500, err, nb);
		}
		else {
			callback(200, 'Corection deleted', nb);
		}
	});
};

IncursiveDriver.prototype.delCorByActReg = function (arid, callback) {
	// body...
	var that = this;
	Corection.model.find().where('groupe', arid).exec(function (err, corections) {
		var i;
		var faildel = [];
		var deldone = [];
		if (err) {
			console.error(err);
			callback(err);
		}
		else if (!corections || !corections.length) {
			callback (200, 'Nothing to do');
		}
		else {
			for (i = 0 ; i < corections.length ; i++) {
				that.delCorection(corections[i]._id, function (code, ret, nb) {
					if (code != 200) {
						faildel.push(ret);
					}
					else {
						deldone.push(ret);
					}
					if (nb == modList.length) {
						tocb.push(faildel);
						tocb.push(deldone);
						tocb.push('Corections deleted');
						callback(200, tocb);
					}
				}, (i + 1));
			}
		}
	});
};

IncursiveDriver.prototype.delActReg = function (arid, callback, nb) {
	// body...
	var that = this;
	var tocb = [];
	that.delCorByActReg(arid, function (code, ret) {
		if (code != 200) {
			callback(code, ret, nb);
		}
		else {
			tocb.push(ret);
			ActReg.model.findById(arid).remove(function (err) {
				if (err) {
					console.error(err);
					callback(500, err, nb);
				}
				else {
					tocb.push('ActivityRegistration deleted');
					callback(200, tocb, nb);
				}
			});
		}
	});
};

IncursiveDriver.prototype.delActRgByAct = function (act, callback) {
	// body...
	ActReg.model.find().where('activity', act).exec(function (err, actregs) {
		var i;
		var faildel = [];
		var deldone = [];
		if (err) {
			console.error(err);
			callback(500, err);
		}
		else if (!actregs || !actregs.length) {
			callback(200, 'Nothing to do');
		}
		else {
			for (i = 0 ; i < actregs.length ; i++) {
				that.delActReg(actregs[i]._id, function (code, ret, nb) {
					if (code != 200) {
						faildel.push(ret);
					}
					else {
						deldone.push(ret);
					}
					if (nb == actregs.length) {
						tocb.push(faildel);
						tocb.push(deldone);
						tocb.push('ActivityRegistrations deleted');
						callback(200, tocb);
					}
				}, (i + 1));
			}
		}
	});
};

IncursiveDriver.prototype.delActivity = function (name, callback, nb) {
	// body...
	var that = this;
	var tocb = [];
	Activity.model.findOne({'name':name}).exec(function (err, activity) {
		if (err) {
			console.error(err);
			callback(500, err, nb);
		}
		else if (!activity) {
			callback(404, 'Activity Not Found', nb);
		}
		else {
			that.delActRgByAct(activity._id, function (code1, c1err) {
				if (code1 != 200) {
					callback(code1, c1err, nb);
				}
				else {
					tocb.push(c1err);
					that.delNotByAct(activity._id, function (code2, c2err) {
						if (code2 != 200) {
							callback(code2, c2err, nb);
						}
						else {
							tocb.push(c2err);
							activity.remove(function (err) {
								if (err) {
									console.error(err);
									callback(500, err, nb);
								}
								else {
									callback(200, tocb, nb);
								}
							});
						}
					});
				}
			});
		}
	});
};

IncursiveDriver.prototype.delActByMod = function (modId, callback) {
	// body...
	var that = this;
	var tocb = [];
	Activity.model.find().where('module', modId).exec(function (err, activities) {
		var i;
		var faildel = [];
		var deldone = [];
		if (err) {
			console.error(err);
			callback(500, err);
		}
		else if (!activities || !activities.length) {
			callback(200, 'Nothing to do');
		}
		else {
			for (i = 0 ; i < activities.length ; i++) {
				that.delActivity(activities[i].name, function (code, ret, nb) {
					if (code != 200) {
						faildel.push(ret);
					}
					else {
						deldone.push(ret);
					}
					if (nb == activities.length) {
						tocb.push(faildel);
						tocb.push(deldone);
						tocb.push('Activities deleted');
						callback(200, tocb);
					}
				}, (i + 1));
			}
		}
	});
};

IncursiveDriver.prototype.delModReg = function (mrid, callback, nb) {
	// body...
	ModReg.model.findById(mrid).remove(function (err) {
		if (err) {
			console.error(err);
			callback(500, err, nb);
		}
		else {
			callback(200, 'ModuleRegistration deleted', nb);
		}
	});
};

IncursiveDriver.prototype.delModRegByMod = function (modId, callback) {
	// body...
	var that = this;
	var tocb = [];
	ModReg.model.find().where('module', modId).exec(function (err, modList) {
		var i;
		var faildel = [];
		var deldone = [];
		if (err) {
			console.error(err);
			callback(500, err);
		}
		else if (!modList || !modList.length) {
			callback(200, 'Nothing to do');
		}
		else {
			for (i = 0 ; i < modList.length ; i++) {
				that.delModReg(modList[i]._id, function (code, ret, nb) {
					if (code != 200) {
						faildel.push(ret);
					}
					else {
						deldone.push(ret);
					}
					if (nb == modList.length) {
						tocb.push(faildel);
						tocb.push(deldone);
						tocb.push('ModuleRegistrations deleted');
						callback(200, tocb);
					}
				}, (i + 1));
			}
		}
	});
};

IncursiveDriver.prototype.delPostByPost = function (postid, callback, nb) {
	// body...
	// recursive...
};

IncursiveDriver.prototype.delForPost = function (postid, callback, nb) {
	// body...
};

IncursiveDriver.prototype.delForPostByThr = function (ftid, callback, nb) {
	// body...
};

IncursiveDriver.prototype.delForThrByCat = function (fcid, callback) {
	// body...
};

IncursiveDriver.prototype.delForCatByMod = function (modId, callback) {
	// body...
	var that = this;
	var tocb = [];
	ForCat.model.findOne({'module':modId}).exec(function (err, forcat) {
		if (err) {
			console.error(err);
			callback(500, err);
		}
		else if (!forcat) {
			callback(200, 'Nothing to do');
		}
		else {
			that.delForThrByCat(forcat._id, function (code, ret) {
				if (code != 200) {
					callback(code, ret);
				}
				else {
					tocb.push(ret);
					forcat.remove(function (err) {
						if (err) {
							console.error(err);
							callback(500, err);
						}
						else {
							tocb.push('ForumCategory deleted')
							callback(200, tocb);
						}
					})
				}
			})
		}
	})
};

IncursiveDriver.prototype.delModule = function (name, callback) {
	// body...
	var that = this;
	var tocb = [];
	Module.model.findOne({'name':name}).exec(function (err, module) {
		if (err) {
			console.error(err);
			callback(500, err);
		}
		else if (!module) {
			callback(404, 'Module Not Found');
		}
		else {
			that.delForCatByMod(module._id, function (code1, c1err) {
				if (code1 != 200) {
					callback(code1, c1err);
				}
				else {
					tocb.push(c1err);
					that.delModRegByMod(module._id, function (code2, c2err) {
						if (code2 != 200) {
							callback(code2, c2err);
						}
						else {
							tocb.push(c2err);
							that.delActByMod(module._id, function (code3, c3err) {
								if (code3 != 200) {
									callback(code3, c3err);
								}
								else {
									tocb.push(c3err);
									module.remove(function (err) {
										if (err) {
											console.error(err);
											callback(500, err);
										}
										else {
											tocb.push('Module deleted');
											callback(200, tocb);
										}
									});
								}
							});
						}
					});
				}
			})
		}
	});
};

