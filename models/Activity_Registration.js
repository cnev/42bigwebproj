var keystone = require('keystone');
var Types = keystone.Field.Types;

var Activity_Registration = new keystone.List('Activity_Registration');

Activity_Registration.add({
	user: {type: Types.Relationship, ref: 'User'},
	activity: {type: Types.Relationship, ref: 'Activity'}
});

Activity_Registration.register();
