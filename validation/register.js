const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // 转为字符串
    data.account = !isEmpty(data.account) ? data.account : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (!Validator.isLength(data.account, { min: 6, max: 30 })) {
        errors.account = "名字的长度不能小于6位并且不能大于30位!";
    }

    if (Validator.isEmpty(data.account)) {
        errors.account = "名字不能为空!";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "邮箱不能为空!";
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = "邮箱不合法!";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "密码不能为空!";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "密码的长度不能小于6位并且不能大于30位!";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};