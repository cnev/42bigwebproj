var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Test Model
 * ==========
 */

var Test = new keystone.List('Test');

Test.add({
	content: String
});

Test.register();

for (var i = 1 ; i < 21 ; i++) {
	var str = '';
	for (var j = 0 ; j < i ; j++)
		str += (j == 0 ? i : '-' + i);
	var test = new Test.model({
		content : str
	});
	test.save(function(err, doc) {
		console.error(err);
		console.log(doc);
	});
}
