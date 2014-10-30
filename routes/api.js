var contactModel = require('../models').contactModel;

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
		if (staff._id) {
			res.send(new Boolean(true));
		} else {
			res.send(new Boolean(false));
		}
	});
}

module.exports.isMember = isMember;