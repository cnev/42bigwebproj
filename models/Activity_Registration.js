var keystone = require('keystone');
var Types = keystone.Field.Types;

var ActivityRegistration = new keystone.List('ActivityRegistration', {
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
});

ActivityRegistration.add({
	user: {type: Types.Relationship, ref: 'User'},
	activity: {type: Types.Relationship, ref: 'Activity'},
	encours: {type: Boolean, default: true},
	peers: {type: Types.Relationship, ref: 'User', many: true}
});

ActivityRegistration.register();

/* ****

function checkact (actreg) {
	Activity.model.findById(actreg.activity).exec(function (err, activity) {
		var now = New Date();
		if (err) {
			console.error(err);
		}
		else if (!activity) {
			console.error('pitisouci');
		}
		else {
			if (activity.period.ends.getTime() < now.getTime()) {
				actreg.encours = false;
				actreg.save(function (err) {
					if (err) {
						console.error(err);
					}
					else {
						setUsrNote(actreg.user);
					}
				})
			}
		}
	});
}

ActivityRegistration.model.find({'user':uid, 'encours':true}).exec(function (err, actList) {
	var i;
	if (err) {
		console.error(err);
	}
	else {
		for (i = 0 ; i < actList.length ; i++) {
			checkact(actList[i]);
		}
		ActivityRegistration.model.find({'user':uid, 'encours':true}).exec(function (err, actinList) {
			if (err) {
				console.error(err);
				else {
					return actinList;
				}
			}
		});
	}
});

**** */
