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

		/*
			1) Preparer la view (new keystone.View)
			2) Charger le res.locals :
				[Collection].model.find()
				.where(['attribut'], ['valeur'])
				.exec(function (err, XOXO){
					if (err)

					else
						res.locals = UN TAS DE TRUCS;
						view.render();
				});

		*/
});

/* :id = ID du ActivityRegistration [Groupe] */
router.get('/correction/:id', function (req, res) {
	/* Verifier que c'est bien la bonne personne */

});

module.exports = router;
