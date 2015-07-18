var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Scale Model
 * ==========
 */

var Notation = new keystone.List('Notation');

Notation.add({
	activity: {type: Types.Relationship, ref: 'Activity'},
	contents: {type: Types.Relationship, ref: 'ScaleElement', many: true}
});

Notation.register();
