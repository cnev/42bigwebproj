var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Scale Model
 * ==========
 */

var ScaleElement = new keystone.List('Scale');

ScaleElement.add({
	title: {type: String},
	text: {type: Types.Textarea},
	grades: {type: Number, many: true},
	eval: {type: Number}
});

ScaleElement.register();
