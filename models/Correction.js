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
	peer: {type: Types.Relationship, ref: 'User'},
	done: {type: Boolean, default: false},
	final_grade: {type: Types.Number},
	gradesByElement: {type: Types.Number, many: true},
	deleted: {type: Boolean, default: false}
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
