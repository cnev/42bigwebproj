var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Module Model
 * ==========
 */

var Module = new keystone.List('Module');

Module.add({
	name: {type: Types.Name, index: true},
	description: {type: Types.Textarea},
	/* slots devrait etre un objet contenant deux valeurs 'actuel' et 'max' */
	slots: {type: Types.Number, default: 424242},
	/* pareil, 'begins' et 'ends' */
	register_period: {type: Types.Date},
	/* pareil */
	period: {type: Types.Date},
	credits: {type: Types.Number}
});


/**
 * Relationships
 */



/**
 * Registration
 */

Module.register();
