var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();

router.get('/', function (req, res) {

	var view = new keystone.View(req, res);

	view.render('index');
});

router.get('/module', function (req, res) {

	var view = new keystone.View(req, res);

	view.render('module_overview');
});

router.get('/module/new', function (req, res) {

	var view = new keystone.View(req, res);

	req.flash('error', 'should be /admin/module/new');
	view.render('index');
});

router.get('/activity', function (req, res) {

	var view = new keystone.View(req, res);

	//view.render('index');
});

router.get('/module/:name', function (req, res) {

	var view = new keystone.View(req, res);

	//view.render('index');
});

router.get('/activity/:name', function (req, res) {

	var view = new keystone.View(req, res);

	//view.render('index');
});



module.exports = router;
