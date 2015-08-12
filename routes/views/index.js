var keystone = require('keystone');
var express = require('express');
var session = require('express-session');
var router = express.Router();

router.get('/', function (req, res) {
	//var test = "<a href='http://www.google.com'>Hello My Friend</a>";
	//res.status(200).send(test);
	var sess = req.session;
	if (sess.logged == true)
	{
		//var view = new keystone.View(req, res);
		//var locals = res.locals;

		// locals.section is used to set the currently selected
		// item in the header navigation.
		//locals.section = 'home';

		// Render the view
		//view.render('index');
		if (sess.userClass == 'staff' || sess.userClass == 'bocal')
		{
			console.log('im an admin');
			res.redirect('/admin');
		}
		else
		{
			console.log('im a student');
			res.redirect('/profile');
		}
		//res.redirect('/profile');
	}
	else
	{
		res.redirect('/login');
		//var view = new keystone.View(req, res);
		//var locals = res.locals;

		// locals.section is used to set the currently selected
		// item in the header navigation.
		//locals.section = 'home';

		// Render the view
		//view.render('login');
	}
	//res.status(200).send(test2);

});

module.exports = router;


