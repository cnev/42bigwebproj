var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Test
 * =========
 */

var Test = new keystone.List('Test');

Test.add({
	content: { type: String }
});

Test.register();
