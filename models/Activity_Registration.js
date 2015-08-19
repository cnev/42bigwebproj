var keystone = require('keystone');
var Types = keystone.Field.Types;

var ActivityRegistration = new keystone.List('ActivityRegistration', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

ActivityRegistration.add({
	user: {type: Types.Relationship, ref: 'User'},
	group: {type: Types.Relationship, ref: 'ProjectGroup'},
	encours: {type: Boolean, default: true},
	peers: {type: Types.Relationship, ref: 'User', many: true},
	deleted: {type: Boolean, default: false}
});

ActivityRegistration.register();
