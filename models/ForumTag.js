var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ForumTag Model
 * ==========
 */

var ForumTag = new keystone.List('ForumTag');

ForumTag.add({
	name: {type: String}
});

ForumTag.register();