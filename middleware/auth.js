const jwt = require("../libs/jwt");
const createError = require("http-errors");
const UserModel = require("../models/User");

module.exports = (req, res, next) => {
	let token = req.headers.authorization;
	if (!token) {
		return next(createError(401));
	}
	jwt.unsign(token, (err, object) => {
		if (err) {
			return next(createError(401));
		} else {
			UserModel.findById(object.id)
				.then(user => {
					if (!user) return next(createError(401));
					req.user = user;
					return next();
				})
				.catch(err => next(err));
		}
	});
};
