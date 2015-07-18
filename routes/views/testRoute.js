// blabla des require
var express = require('express');
var session = require('express-session');

var router = express.Router();

router.get('/maroute/:monparam1', function (req, res) {
	var param1 = req.params.monparam1;

	console.log(param1);
	res.status(200).send(param1);
});

module.exports = router;
