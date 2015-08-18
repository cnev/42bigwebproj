var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Module Model
 * ==========
 */

var Module = new keystone.List('Module', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

Module.add({
	name: {type: String, index: true},
	description: {type: Types.Textarea},
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
	credits: {type: Types.Number},
	deleted: {type: Boolean, default: false}
});


/**
 * Relationships
 */



/**
 * Registration
 */

Module.register();
