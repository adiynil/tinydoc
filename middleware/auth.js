const jwt = require("../libs/jwt");
const createError = require("http-errors");
const User = require("../models/User");

module.exports = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        next(createError(401));
    }
    jwt.unsign(token, (err, object) => {
        if (err) {
            next(createError(401));
        } else {
            User.findById(object.id)
                .then((user) => {
                    if (user) {
                        req.user = user;
                        next();
                    } else {
                        next(createError(401));
                    }
                })
                .catch((err) => next(err));
        }
    });
};