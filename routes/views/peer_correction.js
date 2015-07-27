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

function generatePeers(peerList, user){
	for (var i = 0; i < peerList.length; i++){

	}
}

function allocate_userList(activity_name, userList)
{
	getNbPeers(activity_name, function (err, nbPeers){
		if (err)
			res.status(500).send(err);
		if (nbPeers <= userList.length)
			res.status(500).send('insufficent number of registered users');
		console.log("Required corrections for "+activity_name+" : "+nbPeers);
		for (var i = 0; i < userList.length; i++){
			var usedUsers = [];
			for (var j = 0; j < nbPeers; j++){
				var randomUserId = Math.floor((Math.random() * userList.length));
				if (usedUsers.indexOf(randomUserId) != -1 || randomUserId == i)
					j--;
				else {
					usedUsers.push(randomUserId);
				}
			}
			generatePeers(usedUsers, userList[i]);
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
			allocate_userList(req.params.activity);
		}
	});
});

module.exports = router;
