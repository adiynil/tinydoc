const createError = require("http-errors");

const Book = require("../models/Book");
const Doc = require("../models/Doc");
const Comment = require("../models/Comment");
const User = require("../models/User");

exports.getOne = (req, res, next) => {
	if (req.headers.authorization) return next();
	let { account, identity } = req.params;
	Book.findOne({ identity, account, is_public: true }, (err, book) => {
		if (err) return next(err);
		res.send(book);
	});
};

exports.getOneWithAuth = (req, res, next) => {
	let rule = ({ account, identity } = req.params);
	if (req.user.account != account && req.user.role == "normal")
		rule.is_public = true;
	Book.findOne(rule, (err, book) => {
		if (err) return next(err);
		res.send(book);
	});
};

exports.getByAccount = (req, res, next) => {
	if (req.headers.authorization) return next();
	let { account } = req.params;
	Book.find({ account, is_public: true }, (err, books) => {
		if (err) return next(err);
		res.send(books);
	});
};

exports.getByAccountWithAuth = (req, res, next) => {
	let { account } = req.params;
	if (req.user.account != account && req.user.role == "normal")
		return next(createError(401));
	Book.find({ account }, (err, books) => {
		if (err) return next(err);
		res.send(books);
	});
};

exports.getAll = (req, res, next) => {
	if (req.headers.authorization) return next();
	Book.find({ is_public: true }, (err, books) => {
		if (err) return next(err);
		res.send(books);
	});
};

exports.getAllWithAuth = (req, res, next) => {
	let rule = {};
	if (req.user.role == "normal") rule.is_public = true;
	Book.find(rule, (err, books) => {
		if (err) return next(err);
		res.send(books);
	});
};

exports.delete = (req, res, next) => {
	let { id } = req.params;
	Book.findById(id, (err, book) => {
		if (err) return next(err);
		if (!book) return next(createError(404));
		if (req.user.role == "normal" && req.user.account != book.account)
			return next(createError(401));
		Comment.deleteMany({ book_id: id });
		Doc.deleteMany({ book_id: id });
		Book.findByIdAndDelete(id);
		return res.send();
	});
};

exports.insert = async (req, res, next) => {
	let { account, identity } = req.params;
	let { title, description, is_download, is_public, is_comment, label } =
		req.body;
	let book = {
		title,
		account,
		identity,
		description,
		is_download,
		is_public,
		is_comment,
		label,
	};
	if (req.user.role == "normal" && req.user.account != account)
		return next(createError(401));
	if (!title) return res.status(400).send({ message: "标题是必须的" });
	let exist = await Book.findOne({ account, identity });
	if (exist) return res.status(400).send({ message: "唯一标识已被占用" });
	User.findOne({ account }, (err, user) => {
		if (err) return next(err);
		if (!user) return res.status(404).json({ message: "账号不存在" });
		Book.create(book, err => {
			if (err) return next(err);
			return res.send();
		});
	});
};

exports.update = (req, res, next) => {
	let { id } = req.params;
	let book = ({
		title,
		description,
		is_download,
		is_public,
		is_comment,
		label,
	} = req.body);
	Book.findById(id, (err, exist) => {
		if (err) return next(err);
		if (!exist) return next(createError(404));
		if (req.user.role == "normal" && req.user.account != exist.account)
			return next(createError(401));
		Book.findByIdAndUpdate(id, book, err => {
			if (err) return next(err);
			res.send();
		});
	});
};
