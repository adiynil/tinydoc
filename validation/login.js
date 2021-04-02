const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.account = !isEmpty(data.account) ? data.account : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.type = !isEmpty(data.type) ? data.type : "";

    if (Validator.isEmpty(data.password)) {
        errors.password = "密码不能为空!";
    }
    if (data.type == "email") {
        if (!Validator.isEmail(data.email)) {
            errors.email = "邮箱不合法!";
        }

        if (Validator.isEmpty(data.email)) {
            errors.email = "邮箱不能为空!";
        }
    } else if (Validator.isEmpty(data.type) || data.type == "account") {
        if (Validator.isEmpty(data.account)) {
            errors.email = "账号不能为空!";
        }
    } else {
        errors.type = "login type error";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};