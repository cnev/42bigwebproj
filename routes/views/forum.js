var express = require('express');
var session = require('express-session');
var keystone = require('keystone');

var UsrDrv = require('../../driver/userDriver').UserDriver;

var UserDriver = new UsrDrv();

var router = express.Router();

var ForumCategory = keystone.list('ForumCategory');
var ForumThread = keystone.list('ForumThread');
var ForumPost = keystone.list('ForumPost');

router.get('/', function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.threads = [];

	ForumCategory.model.find().exec(function (err, categories){
		locals.categorylist = categories;
		ForumThread.model.find()
		.sort('createdAt')
		.exec(function (err, threads){
			console.log(threads);
			locals.threads = threads;
			view.render('forum_overview');
		});
	});
});

router.post('/thread/new', function (req, res){
	console.log(req.body);

	UserDriver.getByUid(req.session.user, function (err, user){
		if (err != 200){
			res.status(err).send(user);
		} else {
			var post = new ForumPost.model({
				author: user,
				message: req.body.message,
			});
			post.save(function (err, post_saved){
				if (err){
					res.status(err).send(post_saved);
				} else {
					var thread = new ForumThread.model({
						title: req.body.title,
						author: user,
						category: req.body.category,
						posts: post,
						nb_posts: 1
					});
					thread.save(function (err, thread_saved){
						if (err){
							res.status(err).send(thread_saved);
						}else{
							req.flash('info', 'new thread !');
							res.redirect('/forum');
						}
					});
				}
			})
		}
	});

});

router.get('/view/:id', function (req, res){

	// var view = new keystone.View(req, res);
	var locals = res.locals;
	var thread_list = ForumThread.model.findById(req.params.id)
		.exec(function (err, result)
		{
			locals.posts = result.posts;
			view.render(forum_thread);
		});
	//
});



module.exports = router;


