var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Module Model
 * ==========
 */

var Module = new keystone.List('Module');

Module.add({
	name: {type: Types.Name, required: true, index: true},
	description: {type: Types.Textarea, required: true},
	/* slots devrait etre un objet contenant deux valeurs 'actuel' et 'max' */
	slots: {type: Types.Number, required: true, default: 424242},
	/* pareil, 'begins' et 'ends' */
	register_period: {type: Types.Date, required: true},
	/* pareil */
	period: {type: Types.Date, required: true},
	credits: {type: Types.Number, required: true}
});


/**
 * Relationships
 */



/**
 * Registration
 */

Module.register();
