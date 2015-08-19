var express = require('express');
var session = require('express-session');
var keystone = require('keystone');

var UsrDrv = require('../../driver/userDriver').UserDriver;

var UserDriver = new UsrDrv();

var router = express.Router();

var ForumCategory = keystone.list('ForumCategory');
var ForumThread = keystone.list('ForumThread');
var ForumPost = keystone.list('ForumPost');

function pushPost(posts, id, i, cb){
	ForumPost.model.findById(id).exec(function (err, post){
		ForumPost.model.find()
		.where('reply_of', id)
		.exec(function (err, replies){
			var data = {
				post: post,
				nb_replies: replies.length
			};
			posts.push(data);
			cb(null, i);
		});
	})
}

function fetchPosts(posts, thread, cb){
	for (var i = 0; i < thread.posts.length; i++){
		pushPost(posts, thread.posts[i], i, function (err, q_i){
			if (q_i == thread.posts.length - 1)
				cb(null, 1);
		});
	}
}

router.get('/', function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.threads = [];

	ForumCategory.model.find().exec(function (err, categories){
		locals.categorylist = categories;
		ForumThread.model.find()
		.sort('createdAt')
		.exec(function (err, threads){
			locals.threads = threads;
			view.render('forum_overview');
		});
	});
});

router.post('/thread/new', function (req, res){
	UserDriver.getByUid(req.session.user, function (err, user){
		if (err != 200){
			res.status(err).send(user);
		} else {
			var post = new ForumPost.model({
				author: user.uid,
				message: req.body.message,
			});
			post.save(function (err, post_saved){
				if (err){
					res.status(err).send(post_saved);
				} else {
					var thread = new ForumThread.model({
						title: req.body.title,
						author: user.uid,
						category: req.body.category,
						posts: post,
						nb_posts: 1
					});
					thread.save(function (err, thread_saved){
						if (err){
							res.status(err).send(thread_saved);
						} else {
							req.flash('info', 'new thread !');
							res.redirect('/forum');
						}
					});
				}
			});
		}
	});
});

router.get('/view/thread/:id', function (req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;
	ForumThread.model.findById(req.params.id)
	.exec(function (err, result) {
		if (err) {
			res.status(500).send(result);
		} else if (!result) {
			req.flash('error', 'thread not found');
			res.redirect('/forum');
		} else {
			locals.threadId = req.params.id;
			locals.posts = [];
			locals.data = result;
			fetchPosts(locals.posts, result, function (err, ok){
				view.render('forum_thread');
			});
		}
	});
});

router.get('/view/post/:id', function (req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;
	ForumPost.model.findById(req.params.id)
	.exec(function (err, result) {
		if (err) {
			res.status(err).send(err);
		} else if (!result) {
			req.flash('error', 'post not found');
			res.redirect('/forum');
		} else {
			locals.postId = req.params.id;
				locals.post = result;
				ForumPost.model.find()
				.where('reply_of', req.params.id)
				.sort('createdAt')
				.exec(function (err, replies){
					if (err){
						res.status(err).send(err);
					} else {
						locals.replies = replies;
						view.render('forum_post');
					}
				});
		}
	});
})

router.post('/reply/thread/:id', function (req, res){
	UserDriver.getByUid(req.session.user, function (err, user){
		if (err != 200){
			res.status(err).send(user);
		} else {
			var post = new ForumPost.model({
				author: user.uid,
				message: req.body.message,
			});
			post.save(function (err, post_saved){
				if (err){
					res.status(err).send(post_saved);
				} else {
					ForumThread.model.findById(req.params.id).exec(function (err, thread){
						thread.nb_posts = thread.nb_posts + 1;
						thread.posts.push(post);
						thread.save(function (err, thread_saved){
							if (err){
								res.status(err).send(thread_saved);
							}else{
								req.flash('info', 'new post in the thread !');
								res.redirect('/forum/view/thread/'+req.params.id);
							}
						});
					});
				}
			});
		}
	});
});

router.post('/reply/post/:id', function (req, res){
	UserDriver.getByUid(req.session.user, function (err, user){
		if (err != 200){
			res.status(err).send(user);
		} else {
			var post = new ForumPost.model({
				author: user.uid,
				message: req.body.message,
				reply_of: req.params.id
			});
			post.save(function (err, post_saved){
				if (err){
					res.status(err).send(post_saved);
				} else {
					ForumThread.model.findOne()
					.where('posts').in([req.params.id])
					.exec(function (err, thread){
						if (err) {
							res.status(err).send(thread);
						} else {
							thread.nb_posts = thread.nb_posts + 1;
							thread.save(function (err, thread_saved){
								if (err){
									res.status(err).send(thread_saved);
								}else{
									req.flash('info', 'reply ok !');
									res.redirect('/forum/view/post/'+req.params.id);
								}
							});
						}

					});
				}
			});
		}
	});
});

router.get('/edit/post/:id', function (req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;
	ForumPost.model.findById(req.params.id)
	.exec(function (err, result) {
		if (err) {
			res.status(err).send(err);
		} else if (!result) {
			req.flash('error', 'post not found');
			res.redirect('/forum');
		} else {

			locals.postId = req.params.id;
			locals.post = result;
			ForumPost.model.find()
			.where('reply_of', req.params.id)
			.sort('createdAt')
			.exec(function (err, replies){
				if (err){
					res.status(err).send(err);
				} else {
					locals.replies = replies;
					locals.edit = result;
					view.render('forum_post');
				}
			});
		}
	});
});

router.post('/edit/post/:id', function (req, res){

});

module.exports = router;


