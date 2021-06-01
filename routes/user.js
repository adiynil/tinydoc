const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const gravatar = require("gravatar");

const UserModel = require("../models/User");
const BookModel = require("../models/Book");
const DocModel = require("../models/Doc");
const CollectionModel = require("../models/Collection");
const Comment = require("../models/Comment");
const CollectDocModel = require("../models/CollectDoc");

const auth = require("../middleware/auth");
const crypto = require("../libs/crypto");
const jwt = require("../libs/jwt");
const mailer = require("../libs/mail");

module.exports = router;

router.get("/current", auth, (req, res) => {
	res.json(req.user);
});

router.get("/list", auth, (req, res) => {
	if (req.user.role == "normal") return next(createError(401));
	UserModel.find({}, (error, data) => {
		if (error) return res.status(500).json(error);
		res.status(200).json(data);
	});
});

router.get("/:account", getOne);

router.post("/forgetpassword", async (req, res, next) => {
	try {
		let { account, email, type } = req.body,
			user = null;
		user =
			type == "email"
				? await UserModel.findOne({ email })
				: await UserModel.findOne({ account });
		if (!user) return next(createError(404));
		if (!user.option.is_email_active)
			return res
				.status(400)
				.json({ message: "你的邮箱还没有激活，操作失败" });
		mailer.sendResetPassword(user.account, err => {
			if (err)
				return res.status().send({
					message: "你的邮箱可能失效了，无法接收我们的邮件",
				});
			res.send();
		});
	} catch (error) {
		next(error);
	}
});

router.post("/validemail", (req, res, next) => {
	let { token } = req.body;
	if (!token) res.status(400).send({ message: "无效的token" });
	jwt.unsign(token, async (err, payload) => {
		if (err) return res.status(400).send({ message: "无效的token" });
		try {
			let { account } = payload;
			if (!account)
				return res.status(400).send({ message: "无效的token" });
			let { option } = await UserModel.findOne({ account });
			option.is_email_active = true;
			await UserModel.findOneAndUpdate({ account }, { option });
			return res.status(200).send();
		} catch (error) {
			return next(error);
		}
	});
});

router.post("/changeemail", auth, async (req, res, next) => {
	try {
		let { account, email } = req.body;
		if (req.user.role == "normal" && req.user.account != account)
			return next(createError(401));
		let emailExist = await UserModel.findOne({ email });
		if (emailExist)
			return res.status(400).send({ message: "邮箱已经被绑定" });
		await UserModel.findOneAndUpdate(
			{ account },
			{ option: { is_email_active: false }, email }
		);
		mailer
			.sendEmailValid("account")
			.then(() => {})
			.catch(() => {});
		res.send();
	} catch (error) {
		next(error);
	}
});

router.post("/revalidemail", auth, reValidEmail);

router.post("/login", login);

router.post("/register", register);

router.post("/insert", auth, insertOne);

router.delete("/delete", auth, multiDelete);

router.put("/update", auth, updateOne);

router.put("/changepassword", auth, changePassword);

function login(req, res, next) {
	let { account, email, password, keepLogin, type } = req.body;
	let rule = {};
	if (type == "email") rule = { email };
	else rule = { account };
	UserModel.findOne(rule)
		.then(async user => {
			if (!user) return res.status(400).json({ message: "账号不存在" });
			if (type == "email" && !user.option.is_email_active) {
				return res.status(400).json({
					message: "你的邮箱还没有激活，请使用账号进行登录",
				});
			}
			if (user.status == "forbidden") {
				return res.status(400).json({
					message: "你的账号已经被封禁",
				});
			}
			password = crypto.encrypt(password);
			if (password != user.password)
				return res.status(400).json({ message: "密码不正确" });
			let token = jwt.sign({ id: user.id }, keepLogin);
			await UserModel.findByIdAndUpdate(user.id, {
				last_login: Date.now(),
			});
			return res.status(200).json({
				token,
			});
		})
		.catch(err => {
			next(err);
		});
}

async function register(req, res, next) {
	try {
		let { account, email, password } = req.body;
		let accountExist = await UserModel.findOne({ account });
		if (accountExist)
			return res.status(400).json({ message: "账号已经被注册" });
		let emailBind = await UserModel.findOne({ email });
		if (emailBind)
			return res.status(400).json({ message: "邮箱已经被绑定" });
		let avatar = gravatar.url(email, {
			s: "200",
			r: "pg",
			d: "mm",
			protocol: "https",
		});
		password = crypto.encrypt(password);
		// create user
		await UserModel.create({ account, email, password, avatar });
		// email valid send
		mailer
			.sendEmailValid(account)
			.then(() => {})
			.catch(() => {});
		res.send();
	} catch (error) {
		next(error);
	}
}

async function getOne(req, res, next) {
	let { account } = req.params;
	try {
		let user = await UserModel.findOne({ account }, { password: 0 });
		if (!user) return next(createError(404));
		res.send(user);
	} catch (error) {
		next(error);
	}
}

async function insertOne(req, res, next) {
	let { role } = req.user;
	if (role == "normal") return next(createError(401));
	try {
		let user = req.body,
			{ account, email, password } = req.body;
		if (!account || !email || !password)
			return res
				.status(400)
				.send({ message: "account，email，password是必须的" });
		let accountExist = await UserModel.findOne({ account });
		if (accountExist)
			return res.status(400).json({ message: "账号已经存在" });
		let emailBind = await UserModel.findOne({ email });
		if (emailBind)
			return res.status(400).json({ message: "邮箱已经被绑定" });
		let avatar = gravatar.url(email, {
			s: "200",
			r: "pg",
			d: "mm",
			protocol: "https",
		});
		password = crypto.encrypt(password);
		user.avatar = avatar;
		user.password = password;
		delete user._id;
		await UserModel.create(user);
		res.send();
	} catch (error) {
		next(error);
	}
}

async function multiDelete(req, res, next) {
	let { role } = req.user;
	if (role == "normal") return next(createError(401));
	let list = req.body;
	if (list instanceof Array != true)
		return res.status(400).send({ message: "仅接收数组类型数据" });
	list.forEach(async id => {
		try {
			let { account } = await UserModel.findById(id);
			if (account) {
				let bookList = await BookModel.find({ account });
				let collectionList = await CollectionModel.find({ account });
				bookList.forEach(async book => {
					await DocModel.deleteMany({ book_id: book.id });
					await Comment.deleteMany({ book_id: book.id });
				});
				collectionList.forEach(async collection => {
					await CollectDocModel.deleteMany({
						collection_id: collection.id,
					});
				});
				await BookModel.deleteMany({ account });
				await CollectionModel.deleteMany({ account });
				await UserModel.findByIdAndRemove(id);
			}
		} catch (error) {}
	});
	res.send();
}

async function updateOne(req, res, next) {
	let { role } = req.user,
		{ account, password } = req.body,
		user = req.body;
	if (!account) return res.status(400).send({ message: "account是必须的" });
	// 普通用户不允许修改其他用户
	if (role == "normal" && req.user.account != account)
		return next(createError(401));
	// 普通用户不允许修改的
	if (role == "normal") {
		delete user.email;
		delete user.password;
		delete user.role;
		delete user.status;
		if (user.option) delete user.option.is_email_active;
	}
	// 所有用户均不允许修改的
	delete user.account;
	delete user.create_at;
	delete user.last_login;
	delete user._id;
	delete user.id;
	// 加密密码
	if (password && password != "") user.password = crypto.encrypt(password);
	else delete user.password;
	// 执行修改
	try {
		let origin = await UserModel.findOne({ account });
		for (const key in user.option) {
			if (Object.hasOwnProperty.call(user.option, key)) {
				origin.option[key] = user.option[key];
			}
		}
		user.option = origin.option;
		await UserModel.findOneAndUpdate({ account }, user);
		res.send();
	} catch (error) {
		next(error);
	}
}

async function changePassword(req, res, next) {
	let { role } = req.user,
		{ account, password, newPass } = req.body;
	// if (!account || !password || !newPass)
	// 	return res
	// 		.status(400)
	// 		.send({ message: "account、password、newPass是必须的" });
	password = password ? crypto.encrypt(password) : password;
	newPass = newPass ? crypto.encrypt(newPass) : newPass;
	if (!account) return res.status(400).send({ message: "account是必须的" });
	if (!newPass) return res.status(400).send({ message: "newPass是必须的" });
	if (role == "normal" && req.user.account != account)
		return next(createError(401));
	try {
		let user = await UserModel.findOne({ account });
		if (!user) return next(createError(404));
		if (role == "normal" && user.password != password)
			return res.status(401).send({ message: "原密码不正确" });
		await UserModel.findOneAndUpdate({ account }, { password: newPass });
		res.send();
	} catch (error) {
		next(error);
	}
}

async function reValidEmail(req, res, next) {
	let { role } = req.user,
		{ account } = req.body;
	if (role == "normal" && req.user.account != account)
		return next(createError(401));
	try {
		let { option } = await UserModel.findOne({ account });
		if (!option) return res.status(400).send({ message: "账号不存在" });
		if (option.is_email_active)
			return res
				.status(400)
				.send({ message: "邮箱已经激活了，无需重新激活" });
		mailer
			.sendEmailValid(account)
			.then(() => {})
			.catch(() => {});
		res.send();
	} catch (error) {
		next(error);
	}
}
