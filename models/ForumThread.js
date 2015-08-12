var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ForumThread Model
 * ==========
 */

var ForumThread = new keystone.List('ForumThread', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

ForumThread.add({
	title: {type: String},
	tags: {type: Types.Relationship, ref: 'ForumTag', many: true},
	posts: {type: Types.Relationship, ref: 'ForumPost', many: true},
	nb_posts: {type: Number, default: 0},
	pinned: {type: Types.Boolean},
	author : {type: String}
});

ForumThread.register();
