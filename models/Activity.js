var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Activity Model
 * ==========
 */

var Activity = new keystone.List('Activity');

Activity.add({
	name: {type: String, required: true, index: true},
	description: {type: String},
	subject: {type: Types.Textarea},
	slots: {
		max: {type: Number},
		current: {type: Number}
	},
	registration: {
		begins: {type: Types.Date},
		ends: {type: Types.Date}
	},
	period: {
		begins: {type: Types.Date},
		ends: {type: Types.Date}
	},
	group_size: {
		min: {type: Number},
		max: {type: Number}
	},
	req_corrections: {type: Types.Number},
	auto_group: {type: Types.Boolean},
	module: {type: Types.Relationship, ref: 'Module'},
	type: {type: Types.Select, options: 'project, exam, td'}
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
