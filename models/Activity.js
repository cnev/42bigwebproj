var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Activity Model
 * ==========
 */

var Activity = new keystone.List('Activity');

Activity.add({
	name: { type: Types.Name, required: true, index: true },
});

/**
 * Relationships
 */

Activity.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

/**
 * Registration
 */

Activity.defaultColumns = 'name, email, isAdmin';
Activity.register();
