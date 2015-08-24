var keystone = require('keystone');
var Types = keystone.Field.Types;

var ActivityRegistration = new keystone.List('ActivityRegistration', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

ActivityRegistration.add({
	owner: {type: Types.Relationship, ref: 'User'},
	members: {type: Types.Relationship, ref: 'User', many: true},
	activity: {type: Types.Relationship, ref: 'Activity'},
	encours: {type: Boolean, default: true},
	corrections: {type: Types.Relationship, ref: 'Correction', many: true}
});

ActivityRegistration.register();
