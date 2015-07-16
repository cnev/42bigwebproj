var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Activity Model
 * ==========
 */

var Activity = new keystone.List('Activity');

Activity.add({
	name: {type: Types.Name, required: true, index: true},
	description: {type: Types.Textarea, required: true},
	subject: {type: String, required: true},
	/* slots devrait etre un objet contenant deux valeurs 'actuel' et 'max' */
	slots: {type: Types.Number, required: true, default: 424242},
	/* pareil, 'begins' et 'ends' */
	register_period: {type: Types.Date, required: true},
	/* pareil */
	period: {type: Types.Date, required: true},
	/* ... */
	group_size: {type: Types.Date, required: true},
	req_corrections: {type: Types.Number, required: true},
	auto_group: {type: Types.Boolean, required: true},
	module: {type: Types.Relationship, ref: 'Module', required: true},
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
