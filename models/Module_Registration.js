var keystone = require('keystone');
var Types = keystone.Field.Types;

var ModuleRegistration = new keystone.List('ModuleRegistration');

ModuleRegistration.add({
	user: {type: Types.Relationship, ref: 'User'},
	module: {type: Types.Relationship, ref: 'Module'}
});

ModuleRegistration.register();
