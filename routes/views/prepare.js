var express = require('express');
var session = require('express-session');

var router = express.Router();

router.get('/log', function (req, res) {
	var form = '';

	form += "<div><form action='/prepare/log' method='POST'>";
	form += "<table><tr><td>Login</td><td><input type='text' name='login'></td></tr>";
	form += "<tr><td>Password</td><td><input type='password' name='pw'></td>";
	form += "<tr><td><input type='submit' value='Execute preparations'></td></tr></table></form></div>";
	res.status(200).send(form);
});

router.post('/log', function (req, res) {
	console.log(req.body);
	if (req.body.login == 'chandra' && req.body.pw == 'boum')
		// Insert data sets
		res.status(200).send('YOLOOOOO');
	else
	{
		res.status(500).send('DIE FOOL !');
	}
});

module.exports = router;
