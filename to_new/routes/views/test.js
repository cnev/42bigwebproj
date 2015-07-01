var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
	var test = "<a href='http://www.google.com'>Hello My Friend</a>";
	res.status(200).send(test);
});

module.exports = router;
