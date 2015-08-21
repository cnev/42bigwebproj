//0.gvcd3ta35znf80k90.9yt7rm3yx3b4kj4i0.3zeimtxhxt5ljtt90.tubz1dnkhc8zolxr

var express = require('express');
var session = require('express-session');
var keystone = require('keystone');

var ActDriv = require('../../driver/activityDriver').ActivityDriver;
var UsrDrv = require('../../driver/userDriver').UserDriver;
var ActivityDriver = new ActDriv ();
var UserDriver = new UsrDrv ();

var router = express.Router();

var User = keystone.list('User');
var Module = keystone.list('Module');
var Activity = keystone.list('Activity');
var ActivityRegistration = keystone.list('ActivityRegistration');

router.get('/:link', function (req, res){
	User.model.findOne()
	.where('autologin', req.params.link)
	.exec(function (err, user){
		if (err) {
			req.flash('error', '/autologin/:link error');
			res.redirect('/login');
		} else if (!user) {
			req.flash('error', 'invalid autologin link');
			res.redirect('/login');
		} else {
			var sess = req.session;
			sess.user = user.uid;
			sess.user_id = user;
			sess.pw = user.password;
			sess.logged = true;
			 sess.userClass = user.isStaff.bocalStaff ? 'staff' :
					(user.isStaff.bocalStudent ? 'bocal' : 'student');
			sess.isAdmin = (user.isStaff.bocalStaff || user.isStaff.bocalStudent) ? true : false;
			req.session.forceLog = false;
			res.redirect("/");
		}
	});
});

module.exports = router;
