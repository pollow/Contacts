var contactModel = require('../models').contactModel;

function index(req, res, next) {
	if (!req.session.authFlag) {
		res.redirect('/404');
	}
	res.render('api', {title: 'Contact - API', loggedin: 1});
}

function isMember(req, res, next) {
	var sid = req.query.sid;

	contactModel.findOne(
	{
		sid: sid
	},
	function(err, staff) {
		if (err) {
			next(err);
		}
		if (staff) {
			res.json({
				"sid": sid,
				"isMember": true
			});
		} else {
			res.json({
				"sid": sid,
				"isMember": false
			});
		}
	});
}

module.exports.isMember = isMember;
module.exports.index = index;