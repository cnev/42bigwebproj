var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Scale Model
 * ==========
 */

var Scale = new keystone.List('Scale');

Scale.add({
	name: { type: Types.Name, required: true, index: true },
});

/**
 * Relationships
 */

Scale.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

/**
 * Registration
 */

Scale.defaultColumns = 'name, email, isAdmin';
Scale.register();
