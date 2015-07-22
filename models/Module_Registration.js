var keystone = require('keystone');
var Types = keystone.Field.Types;

var Module_Registration = new keystone.List('Module_Registration');

Module_Registration.add({
	user: {type: Types.Relationship, ref: 'User'},
	module: {type: Types.Relationship, ref: 'Module'}
});

Module_Registration.register();
