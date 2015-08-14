var express = require('express');
var session = require('express-session');
var keystone = require('keystone');
var Activity = keystone.list('Activity');
var ActivityRegistration = keystone.list('ActivityRegistration');
var Module = keystone.list('Module');
var User = keystone.list('User');

var router = express.Router();

function build_userList(activity_name, cb)
{
	var list = [];
	Activity.model.findOne({'name' : activity_name})
		.exec(function (err, activity_res){
			if (err)
				cb(err);
			else if (!activity_res)
				cb(1, 1);
			else {
				ActivityRegistration.model.find({'activity': activity_res})
					.exec(function (err, registration_res){
						if (err)
							cb(err);
						else if (!activity_res)
							cb(1, 1);
						else {
							for (var i = 0; i < registration_res.length; i++){
								console.log("User: "+registration_res[i].user);
								list.push(registration_res[i].user);
							}
							cb(null, list);
						}
					});
			}
		});
}

function getNbPeers(activity_name, cb){
	Activity.model.findOne({'name' : activity_name})
		.exec(function (err, activity_res){
			if (err)
				cb(err)
			else if (!activity_res)
				cb(1, 1);
			else {
				cb(null, activity_res.req_corrections);
			}
		});
}

function generatePeers (userList, peerList, user, activity_name) {
	console.log("peerList to be included to user("+user+"): "+peerList);
	Activity.model.findOne({'name': activity_name}).exec(function (err, activity) {
		var to_ret = {};
		if (err) {
			console.log("ERROR 10");
			to_ret.err = err;
			return (to_ret);
		}
		else if (!activity) {
			console.log("ERROR 11");
			to_ret.err = "What kind of black magic is that fucking shit?!";
			return (to_ret);
		}
		else {
			ActivityRegistration.model.findOne({'activity': activity})
				.where('user', user)
				.exec(function (err, actReg) {
				if (err) {
					console.log("ERROR 12");
					to_ret.err = err;
					return (to_ret);

				}
				else if (!actReg) {
					console.log("ERROR 13");
					to_ret.err = "What kind of black magic is that fucking shit?! V2";
					return (to_ret);
				}
				else {
					console.log("CLEAR ?!");
					console.log("Pre-FOR: USER: "+user);
					for (var i = 0; i < peerList.length; i++){
						console.log("PUSHING peerList!= "+peerList[i]);
						actReg.peers.push(peerList[i]);
						//if (i == peerList.length - 1)
						//	rdy = true;
					}
					actReg.save(function (err, saved) {
						if (err) {
							to_ret.err = err;
							return (to_ret);
						}
						else {
							to_ret = saved;
							to_ret.err = null;
							console.log(saved);
							return (to_ret);
						}
					});
				}
			});
		}
	});
}

function allocate_userList(activity_name, userList, cb){

	getNbPeers(activity_name, function (err, nbPeers){
		var to_ret = [];
		console.log("Required corrections for "+activity_name+" : "+nbPeers);
		if (err)
			cb(err);
		else if (userList.length <= nbPeers)
			cb(1, 1);
		else {
			for (var i = 0; i < userList.length; i++){
				var usedUsers = [];
				for (var j = 0; j < nbPeers; j++){
					var randomUserId = Math.floor((Math.random() * userList.length));
					if (usedUsers.indexOf(randomUserId) != -1 || randomUserId == i)
						j--;
					else {
						usedUsers.push(userList[randomUserId]);
					}
				}
				var tmp;
				tmp = generatePeers(userList, usedUsers, userList[i], activity_name);
				//if (tmp.err) {
				//	cb(tmp.err);
				//		return ;
				//}
				//else
				//	to_ret.push(tmp);
			}
			cb(null, to_ret);
		}
	});
}

router.get('/allocate/:activity', function (req, res) {
	build_userList(req.params.activity, function (err, userList) {
		if (err && !userList)
			res.status(500).send(err);
		else if (err) {
			res.status(404).send('activity not found');
		}
		else {
			allocate_userList(req.params.activity, userList, function (err, ret) {
				if (err && !ret)
					res.status(500).send(err);
				else if (err)
					res.status(404).send('insufficent number of registered users');
				else
					res.status(200).send("YOLO !");
			});
		}
	});
});

function fetchCorrections(tab, activity, i, cb){
	tab.push(activity);
	cb(null,i);
}

function pushCorrection(ret, activity, i, cb){
	User.model.findById(activity.user)
	.exec(function (err, user){
		Activity.model.findById(activity.activity)
		.exec(function (err, act){
			var obj = {
				activity: act,
				peer: user
			};
			console.log('obj');
			console.log(obj);
			console.log('endof obj');
			ret.push(obj);
			cb(null, i);
		});
	});
}

function displayCorrections(req, res, view){
	var locals = res.locals;

	var tab = locals.activities;
	locals.corrections = [];

	for (var i = 0; i < tab.length; i++){
		pushCorrection(locals.corrections, tab[i], i, function (err, q_i){
			if (q_i == tab.length - 1)
				view.render('correction_overview');
		})
	}
}

router.get('/',function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.activities = [];

	User.model.findOne()
	.where('uid', req.session.user)
	.exec(function (err, user){
		ActivityRegistration.model.find()
		.where('user', user)
		.exec(function (err, activities) {
			for (var i = 0; i < activities.length; i++) {
				if (activities[i].peers.length > 0) {
					fetchCorrections(locals.activities, activities[i], i, function (err, ret){
						if (ret == activities.length - 1)
							displayCorrections(req, res, view);
					});
				}
			}
		})
	})

});

module.exports = router;
