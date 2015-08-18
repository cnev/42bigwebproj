var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ForumPost Model
 * ==========
 */

var ForumPost = new keystone.List('ForumPost', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

ForumPost.add({
	author: {type: String},
	message: {type: Types.Textarea},
	reply_of: {type: Types.Relationship, ref: 'ForumPost'},
	deleted: {type: Boolean, default: false}
});

ForumPost.register();
