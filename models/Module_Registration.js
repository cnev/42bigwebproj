var keystone = require('keystone');
var Types = keystone.Field.Types;

var ModuleRegistration = new keystone.List('ModuleRegistration', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

ModuleRegistration.add({
	user: {type: Types.Relationship, ref: 'User'},
	module: {type: Types.Relationship, ref: 'Module'},
	status: {type: Types.Select, options: 'success, fail, pending'},
	deleted: {type: Boolean, default: false}
});

ModuleRegistration.register();
