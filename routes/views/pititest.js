var express = require('express');
var session = require('express-session');
var keystone = require('keystone');

var Test = keystone.list('Test');

var router = express.Router();

router.get('/', function (req, res)
{
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.data = {test:[]};
	Test.paginate({
		page: req.query.page || 1,
		perPage: 5,
		maxPages: 10
	})
	.exec(function(err, results) {
		locals.data.test = results;
	});
	view.render('pititest')
});

module.exports = router;

