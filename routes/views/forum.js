var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var router = express.Router();

var ForumTag = keystone.list('ForumTag');
var ForumThread = keystone.list('ForumThread');

router.get('/', function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.tags = [];
	locals.threads = [];

	var tag_list = ForumTag.model.find()
		.sort('name')
		.exec(function (err, result)
		{
			for (var i = 0; i < result.length; i++)
				locals.tags.push(result[i].name);
		});
	var thread_list = ForumThread.model.find()
		.sort('-date')
		.exec(function (err, result)
		{
			for (var i = 0; i < result.length; i++)
				locals.threads.push(result[i]);
		});
	view.render('forum_overview');
});

router.get('/thread/:id', function (req, res){

	// var view = new keystone.View(req, res);
	var locals = res.locals;
	var thread_list = ForumThread.model.findOne()
		.exec(function (err, result)
		{
			for (var i = 0; i < result.length; i++)
				locals.threads.push(result[i]);
		});
	//view.render(forum_thread);
});

/*
	/forum/thread/:id
*/
module.exports = router;
