var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Module Model
 * ==========
 */

var Module = new keystone.List('Module');

Module.add({
	name: {type: Types.Name, required: true, index: true},
	description: {type: Types.Text},

});


/**
 * Relationships
 */



/**
 * Registration
 */

Module.register();
