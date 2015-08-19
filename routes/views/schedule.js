var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var schedule = require('node-schedule');
var router = express.Router();

router.get('/', function (req, res) {
	var j = schedule.scheduleJob('*/1 * * * *', function() {
		console.log('The answer to life, the universe, and everything!');
		var date = new Date;
		console.log('this prints on '+date.toLocaleString());
	});
	req.flash('info', 'schedule is ON');
	res.redirect('/admin');
});

module.exports = router;
