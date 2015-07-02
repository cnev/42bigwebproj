var keystone = require('keystone');
var Types = keystone.Field.Types;

var Forum_post = new keystone.List('Forum_post');

Forum_post.add({
	id: { type: Types.Number, required: true, index: true },
	author: { type: Types.Name, required: true },
	views: { type: Types.Number, required: false, default: 0},
	content: { type: Types.Text, required: true},
});

Forum_post.register();
