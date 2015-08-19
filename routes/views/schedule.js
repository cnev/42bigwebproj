var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var schedule = require('node-schedule');
var router = express.Router();

var ActRDrv = require('../../driver/actRegisDriver').ActRegisDriver;
var ActRegisDriver = new ActRDrv ();

router.get('/', function (req, res) {
	var job_timer = schedule.scheduleJob('*/1 * * * *', function() {
		console.log('The answer to life, the universe, and everything!');
		var date = new Date;
		console.log('this prints on '+date.toLocaleString());
	});
	var job_end_activities = schedule.scheduleJob('*/1 * * * *', function() {
		ActRegisDriver.end_activities(function (err, end){

		});
	});
	req.flash('info', 'schedule is ON');
	res.redirect('/admin');
});

module.exports = router;
