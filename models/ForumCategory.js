var keystone = require('keystone');
var Types = keystone.Field.Types;

var ForumCategory = new keystone.List('ForumCategory');

ForumCategory.add({
	name: {type: String},
	deleted: {type: Boolean, default: false}
});

ForumCategory.register();
