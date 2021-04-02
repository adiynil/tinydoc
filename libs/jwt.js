const jwt = require("jsonwebtoken");
const config = require("../config/base").jwt;

exports.sign = function(payload, isKeepLogin = false) {
    let options = {
        expiresIn: config.defaultExpiresIn,
    };
    if (isKeepLogin.toString() == "true") {
        options.expiresIn = config.expiresIn;
    }
    let token = jwt.sign(payload, config.secretOrKey, options);
    return token;
};
exports.unsign = function(token, callback) {
    jwt.verify(token, config.secretOrKey, (err, decoded) => {
        if (err) {
            return callback(err);
        }
        delete decoded.iat;
        delete decoded.exp;
        callback(null, decoded);
    });
};