var keystone = require('keystone');
var Types = keystone.Field.Types;

var ForumCategory = new keystone.List('ForumCategory');

ForumCategory.add({
	name: {type: String},
	module: {type: Types.Relationship, ref: 'Module'}
});

ForumCategory.register();
