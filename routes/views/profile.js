var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();

router.get('/', function (req, res) {

	var view = new keystone.View(req, res);

	view.render('index');
});

module.exports = router;
