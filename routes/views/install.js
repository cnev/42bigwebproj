var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var Activity = keystone.list('Activity');
var ActivityRegistration = keystone.list('ActivityRegistration');
var Module = keystone.list('Module');
var User = keystone.list('User');

var router = express.Router();

router.get('/', function (req, res) {

	var to_send = '';

	var add_mod = new Module.model({
		name: 'ModuleTest',
		description: "This module will be used in order to test or beautiful intranet.",
		slots: {
			max: 42,
			current: 0
		},
		registration: {
			begins: new Date(2015, 07, 14, 8, 42, 0, 0),
			ends: new Date(2015, 01, 15, 23, 42, 0, 0)
		},
		period: {
			begins: new Date(2015, 07, 14, 8, 42, 0, 0),
			ends: new Date(2015, 08, 16, 23, 42, 0, 0)
		},
		credits: 42,
		ObjectId: "55afb685477535fe144ed041"
	});
	add_mod.save(function (err, q_saved){
		if (err){
			console.error(err);
			res.status(500).send(err);
		}
		else {
			console.log(q_saved);
			to_send += '<p>module ModuleTest successfully added</p>'


			var add_a = new Activity.model({
				name: "Twins",
				description: "The first activity you're going to work on!",
				subject: "this subject is goint to be very long ... was it?",
				slots: {
					max: 1,
					current: 0
				},
				registration: {
					begins: new Date(2015, 07, 14, 8, 42, 0, 0),
					ends: new Date(2015, 01, 15, 23, 42, 0, 0)
				},
				period: {
					begins: Date(2015, 07, 14, 8, 42, 0, 0),
					ends: Date(2015, 08, 16, 23, 42, 0, 0)
				},
				group_size: {
					min: 1,
					max: 4
				},
				req_corrections: 1,
				auto_group: false,
				module: ObjectId("55afb685477535fe144ed041"),
				type: 'project'
			});
			add_a.save(function (err, q_saved) {
				if (err) {
					console.log("FAIL !");
					console.error(err);
					res.status(500).send(err);
				}
				else {
					console.log(q_saved);
					to_send += '<p>activity Twins successfully added</p>'

					res.status(200).send(to_send);
				}
			});

		}
	});


});

module.exports = router;
