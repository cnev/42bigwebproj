var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Correction Model
 * ==========
 */

var Correction = new keystone.List('Correction', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

Correction.add({
	name: { type: Types.Name, required: true, index: true },
});

/**
 * Relationships
 */

Correction.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

/**
 * Registration
 */

Correction.defaultColumns = 'name, email, isAdmin';
Correction.register();
