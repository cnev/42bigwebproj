var keystone = require('keystone');
var Types = keystone.Field.Types;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model = mongoose.model;

/**
 * User Test
 * =========
 */

//var toModel = Model('toModel', toTest);

var Test = new keystone.List('Test');

Test.add({
	content: { type: String, many: true },
	deleted: {type: Boolean, default: false}
});

Test.register();
