var keystone = require('keystone');
var Types = keystone.Field.Types;

var ProjectGroup = new keystone.List('ProjectGroup', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

ProjectGroup.add({
	owner: {type: Types.Relationship, ref: 'User'},
	members: {type: Types.Relationship, ref: 'User', many: true},
	activity: {type: Types.Relationship, ref: 'Activity'},
	assigned: {type: Types.Boolean, default: false},
	correctors: {type: Types.Relationship, ref:'User', many: true},
	corrections_done: {type: Number, default: 0},
	deleted: {type: Boolean, default: false}
});

ProjectGroup.register();
