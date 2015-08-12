var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * NotationElement Model
 * ==========
 */

var NotationElement = new keystone.List('NotationElement');

NotationElement.add({
	title: {type: String},
	text: {type: Types.Textarea},
	grades: {type: Number, many: true}
});


NotationElement.register();
