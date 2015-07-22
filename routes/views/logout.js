var express = require('express');
var session = require('express-session');

var router = express.Router();

router.get('/', function (req, res) {
	//var test = "<a href='http://www.google.com'>Hello My Friend</a>";
	//res.status(200).send(test);
	/*req.session.destroy(function () {
		res.redirect("/");
	});*/
	var sess = req.session;
	sess.user = '';
	sess.logged = false;
	sess.atLogin = true;
	//req.session.cookie.expires = new Date(Date.now() + 0);
	//req.session.cookie.maxAge = 0;
	//req.session.destroy(function () {
	res.redirect("/login");
	//});
});

module.exports = router;
