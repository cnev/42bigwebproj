var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Activity Model
 * ==========
 */

var Activity = new keystone.List('Activity');

Activity.add({
	name: {type: Types.Name, required: true, index: true},
	description: {type: Types.Textarea},
	subject: {type: String},
	/* slots devrait etre un objet contenant deux valeurs 'actuel' et 'max' */
	slots: {type: Types.Number, default: 424242},
	/* pareil, 'begins' et 'ends' */
	register_period: {type: Types.Date},
	/* pareil */
	period: {type: Types.Date},
	/* ... */
	group_size: {type: Types.Date},
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
