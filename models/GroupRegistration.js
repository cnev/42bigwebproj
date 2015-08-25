var keystone = require('keystone');
var Types = keystone.Field.Types;

var GroupRegistration = new keystone.List('GroupRegistration', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

GroupRegistration.add({
	owner: {type: Types.Relationship, ref: 'User'},
	members: {type: Types.Relationship, ref: 'ActivityRegistration', many: true},
	activity: {type: Types.Relationship, ref: 'Activity'},
	encours: {type: Boolean, default: true}/*,
	corrections: {type: Types.Relationship, ref: 'Correction', many: true}*/
});

GroupRegistration.register();

