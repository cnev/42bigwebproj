var keystone = require('keystone');

var User = keystone.list('User');

function toObj (src, dest) {
	if (src) {
		for (var key in dest) {
			if (dest[key] == instanceof(Object)) {
				dest[key] = toObj(src[key], dest[key]);
			}
			else if (src[key] != dest[key]) {
				dest[key] = src[key];
			}
		}
	}
	return (dest);
}

function editUsr (req, res) {
	var toEdit = req.body.usr;
	User.model.findOne({'uid':toEdit.uid}).exec(function (err, usr) {
		if (err) { res.status(500).send(err); }
		else if (!usr) { res.status(404).send('usr not found'); }
		else {
			usr = toObj(toEdit, usr);
			usr.save(function(err, saved) {
				if (err) {res.status(500).send(err);}
				else {res.status(200).send(saved);}
			});
		}
	});
}

function findUser (req, res, uid) {
	var q = User.model.findOne({'uid': uid})
		.exec(function (err, q_res) {
			return(q_res.ObjectId);
		});
}

function findModule (req, res, name) {
	var q = Module.model.findOne({'name': name})
		.exec(function (err, q_res) {
			return(q_res.ObjectId);
		});
}
