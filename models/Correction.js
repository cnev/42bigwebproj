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
	peer: {type: Types.Relationship, ref: 'User'}, //correcteur
	groupe: {type : Types.Relationship, ref: 'ActivityRegistration'}, //groupe de corriger
	done: {type: Boolean, default: false}, // corriger ?
	final_grade: {type: Types.Number}, // note final
	gradesByElement: {type: Types.Number, many: true} // note par element
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
