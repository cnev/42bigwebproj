var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ForumPost Model
 * ==========
 */

var ForumPost = new keystone.List('ForumPost');

ForumPost.add({
	post_id: {type: Number},
	author: {type: String},
	date: {type: Types.Date},
	message: {type: Types.Textarea}	
});

ForumPost.register();