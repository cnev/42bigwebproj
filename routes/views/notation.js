var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var Notation = keystone.list('Notation');

var router = express.Router();

router.get('/', function (req, res) {
	/* Recap des corrections a faire */
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.corr = [];

	UserDriver.getByUid(req.session.user, function (err, user){
		Correction.model.find()
		.where('peer', user)
		.exec(function (err, corr) {
			if (err)
				res.status(err).send(err);
			else
			{
				res.locals.corr = corr;
				console.log(corr);
				view.render('notation_overview');
			}
		});
	});
});

/* :id = ID du ActivityRegistration [Groupe] */
router.get('/correction/:id', function (req, res) {
	/* Verifier que c'est bien la bonne personne */

});

module.exports = router;
