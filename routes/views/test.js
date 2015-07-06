var express = require('express');
var session = require('express-session');

var router = express.Router();

router.get('/', function (req, res) {
	//var test = "<a href='http://www.google.com'>Hello My Friend</a>";
	//res.status(200).send(test);
	var sess = req.session;
	if (sess.logged == 'true')
	{
		var test2 = '';
		test2 += "<div><p>Hello "+sess.user+" !</p></div>";
		test2 += "<div><form action='/search' method='POST'><label for='username'>Username:</label><input type='text' id='username' name='username'><input type='submit' value='Login'></form></div>";
		test2 += "<div><a href='logout'>LOG OUT</a></div>";
	}
	else
		var test2 = "<a href='login'>LOG IN</a>";
	res.status(200).send(test2);

});

module.exports = router;
