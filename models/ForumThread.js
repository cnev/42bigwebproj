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
	author: {type: Types.Relationship, ref: 'User'},
	category: {type: Types.Relationship, ref: 'ForumCategory'},
	posts: {type: Types.Relationship, ref: 'ForumPost', many: true},
	nb_posts: {type: Number, default: 0},
	pinned: {type: Types.Boolean, default: false}

});

ForumThread.register();
