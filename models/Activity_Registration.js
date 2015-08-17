var keystone = require('keystone');
var Types = keystone.Field.Types;

var ActivityRegistration = new keystone.List('ActivityRegistration', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

ActivityRegistration.add({
	user: {type: Types.Relationship, ref: 'User'},
	activity: {type: Types.Relationship, ref: 'Activity'},
	encours: {type: Boolean, default: true},
	peers: {type: Types.Relationship, ref: 'User', many: true}
});

ActivityRegistration.register();
