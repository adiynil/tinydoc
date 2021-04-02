const gravatar = require("gravatar");
const createError = require("http-errors");
const validator = require("validator");
const crypto = require("../libs/crypto");
const jwt = require("../libs/jwt");
const mailer = require("../libs/mail");

const User = require("../models/User");
const UserOption = require("../models/UserOption");
const Book = require("../models/Book");
const Doc = require("../models/Doc");
const Collection = require("../models/Collection");
const InvitationCode = require("../models/InvitationCode");
const Label = require("../models/Label");
const Comment = require("../models/Comment");
const CollectDoc = require("../models/CollectDoc");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

exports.register = function(req, res, next, callback = null) {
    const user = req.body;
    const { errors, isValid } = validateRegisterInput(user);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ account: user.account })
        .then((data) => {
            if (data) {
                res.status(400).json({ message: "用户已经存在" });
            } else {
                User.findOne({ email: user.email })
                    .then((data) => {
                        if (data) res.status(400).json({ message: "邮箱已经被绑定" });
                        else {
                            const avatar = gravatar.url(user.email, {
                                s: "200",
                                r: "pg",
                                d: "mm",
                                protocol: "https",
                            });
                            const password = crypto.encrypt(user.password);
                            User.create({
                                    account: user.account,
                                    email: user.email,
                                    password,
                                    avatar,
                                })
                                .then(() => {
                                    UserOption.create({ account: user.account })
                                        .then(() => {
                                            // active link
                                            sendmail(user.account, user.email);
                                            if (callback) {
                                                callback();
                                            } else {
                                                res.status(200).json({ message: "注册成功！" });
                                            }
                                        })
                                        .catch(() => {});
                                })
                                .catch((err) => {
                                    res.status(500).json(err);
                                });
                        }
                    })
                    .catch((err) => {
                        res.status(500).json(err);
                    });
            }
        })
        .catch((err) => {
            res.status(500).json(err);
        });
};

exports.login = function(req, res, next) {
    const user = req.body;
    const { errors, isValid } = validateLoginInput(user);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    if (user.type == "email") {
        rule = { email: user.email };
    } else {
        rule = { account: user.account };
    }
    User.findOne(rule)
        .then((data) => {
            if (!data) return res.status(400).json({ message: "账号不存在" });
            let password = crypto.decrypt(data.password);
            if (!(password == user.password))
                return res.status(400).json({ message: "密码不正确" });
            let token = jwt.sign({ id: data.id }, user.keepLogin);
            // update last_login
            res.status(200).json({
                token,
            });
        })
        .catch((e) => res.status(500).json(e));
};

exports.active = function(req, res, next) {};

exports.getAll = function(req, res, next) {
    const role = req.user.role;
    if (role == "normal") next(createError(401));
    User.find({}, { password: 0 }, (error, data) => {
        if (error) res.status(500).json(error);
        res.status(200).json(data);
    });
};

exports.getOne = (req, res, next) => {
    if (req.params.account == req.user.account || req.user.role != "normal") {
        UserOption.findOne({ account: req.params.account }, (err, data) => {
            if (err) res.status(200).json(err);
            if (!data) {
                UserOption.create({ account: req.params.account })
                    .then((option) => {
                        req.user.option = option;
                        res.status(200).json(req.user);
                    })
                    .catch(() => {});
            } else {
                req.user.option = data;
                res.status(200).json(req.user);
            }
        });
    } else {
        next(createError(401));
    }
};

exports.deleteOne = (req, res, next) => {
    if (req.params.account == req.user.account || req.user.role == "superadmin") {
        DeleteUser(req.params.account);
        return res.status(200).json({ message: "deleted" });
    }
    console.log("out");
    next(createError(401));
};

exports.delete = (req, res, next) => {
    if (req.user.role != "superadmin") next(createError(401));
    const list = req.body;
    list.forEach((user) => {
        DeleteUser(user.id);
    });
    res.status(200).json({ message: "deleted" });
};

function DeleteUser(account) {
    User.findOneAndRemove({ account: account }, (e) => {
        if (e) console.log(e);
    });
    UserOption.findOneAndRemove({ account: account }, (e) => {
        if (e) console.log(e);
    });
    Book.find({ account: account }, { id: 1 }, (err, list) => {
        if (err) console.log(err);
        list.forEach((book) => {
            Comment.deleteMany({ book_id: book.id }, (e) => {
                if (e) console.log(e);
            });
            Label.deleteMany({ book_id: book.id }, (e) => {
                if (e) console.log(e);
            });
            Doc.deleteMany({ book_id: book.id }, (e) => {
                if (e) console.log(e);
            });
        });
        Book.deleteMany({ account: account }, (e) => {
            if (e) console.log(e);
        });
    });
    Collection.find({ account: account }, { id: 1 }, (err, list) => {
        if (err) console.log(err);
        list.forEach((col) => {
            CollectDoc.deleteMany({ collection_id: col.id }, (e) => {
                if (e) console.log(e);
            });
        });
        Collection.deleteMany({ account: account }, (e) => {
            if (e) console.log(e);
        });
    });
    InvitationCode.deleteMany({ account: account }, (e) => {
        if (e) console.log(e);
    });
}

function sendmail(account, email) {
    UserOption.findOne({ account: account }, (err, data) => {
        if (err) console.log(err);
        if (data) {
            let token = jwt.sign({ account: account });
            UserOption.findOneAndUpdate({ account: account }, { is_email_active: false });
            let mail = {
                to: email,
                subject: require("../config/emailValidTemplate").subject,
                html: require("../config/emailValidTemplate").html(account, token),
            };
            mailer(mail);
        }
    });
}

exports.updateOne = (req, res, next) => {
    if (req.params.account == req.user.account || req.user.role != "normal") {
        let update = req.body;
        // 普通用户不允许修改的选项
        if (req.user.role == "normal") {
            delete update.role;
            delete update.status;
        }
        // 涉及数据索引的不允许修改
        delete update.last_login;
        delete update.create_at;
        delete update.account;
        delete update._id;

        if (update.password) {
            if (validator.isEmpty(update.password))
                return res.status(400).json({ password: "密码不能为空" });
            if (!validator.isLength(update.password, { min: 6, max: 30 }))
                return res
                    .status(400)
                    .json({ password: "密码的长度不能小于6位并且不能大于30位" });
            update.password = crypto.encrypt(update.password);
        }

        if (update.email) {
            if (validator.isEmpty(update.email)) {
                return res.status(400).json({ email: "邮箱不能为空!" });
            }
            if (!validator.isEmail(update.email)) {
                return res.status(400).json({ email: "邮箱不合法!" });
            }
            User.findOne({ email: update.email }, (err, one) => {
                if (err) return next(err);
                if (one) return res.status(400).json({ email: "邮箱已经被绑定" });
                User.findOneAndUpdate({ account: req.params.account },
                    update,
                    (err) => {
                        if (err) return next(err);
                        if (req.params.account == req.user.account)
                            sendmail(req.params.account, update.email);
                        res.status(200).json({ message: "OK" });
                    }
                );
            });
        } else {
            User.findOneAndUpdate({ account: req.params.account }, update, (err) => {
                if (err) return next(err);
                res.status(200).json({ message: "OK" });
            });
        }
    } else {
        next(createError(401));
    }
};

exports.insert = (req, res, next) => {
    const role = req.user.role;
    if (role == "normal") next(createError(401));
    const update = {};
    if (req.body.name) update.name = req.body.name;
    if (req.body.site && validator.isURL(req.body.site))
        update.site = req.body.site;
    if (req.body.description) update.description = req.body.description;
    if (
        role == "superadmin" &&
        (req.body.role == "normal" || req.body.role == "admin")
    )
        update.role = req.body.role;
    this.register(req, res, next, () => {
        User.findOneAndUpdate({ account: req.body.account }, update, (err) => {
            if (err) next(err);
            res.status(200).json({ message: "OK" });
        });
    });
};

exports.validemail = (req, res, next) => {
    console.log(req.query);
    if (!req.query.token) next(createError(404));
    const token = req.query.token;
    if (token)
        jwt.unsign(token, (e, data) => {
            if (e) return res.status(400).json(e);
            UserOption.findOne({ account: data.account }, (err, option) => {
                if (err) return next(err);
                if (option) {
                    UserOption.findOneAndUpdate({ account: option.account }, { is_email_active: true },
                        (error) => {
                            if (error) return next(error);
                            res.status(200).json({ message: "OK" });
                        }
                    );
                }
            });
        });
};