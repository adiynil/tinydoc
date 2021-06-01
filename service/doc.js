const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

const Doc = require("../models/Doc");
const Book = require("../models/Book");

exports.getById = async (req, res, next) => {
	try {
		let { id } = req.params;
		let doc = await Doc.findById(id);
		res.send(doc);
	} catch (error) {
		next(error);
	}
};

exports.getAll = (req, res, next) => {
	if (req.headers.authorization) return next();
	// 找到所有公开的知识库
	Book.find({ is_public: true }, async (err, books) => {
		if (err) return next(err);
		let result = [];
		// 遍历知识库列表拿到所有的文档，只能手动for同步循环
		for (let index = 0; index < books.length; index++) {
			let docs = await Doc.find({ book_id: books[index]._id });
			result = [...result, ...docs];
		}
		res.send(result);
	});
};

exports.getAllWithAuth = (req, res, next) => {
	let rule = {};
	if (req.user.role == "normal") rule.is_public = true;
	Book.find({}, async (err, books) => {
		if (err) return next(err);
		let result = [];
		for (let index = 0; index < books.length; index++) {
			let docs = await Doc.find({ book_id: books[index]._id });
			result = [...result, ...docs];
		}
		res.send(result);
	});
};

exports.getByAccount = (req, res, next) => {
	if (req.headers.authorization) return next();
	if (!req.params.account) return next(createError(400));
	Book.find(
		{ account: req.params.account, is_public: true },
		async (err, books) => {
			if (err) return next(createError(500));
			let result = [];
			for (let index = 0; index < books.length; index++) {
				let docs = await Doc.find({ book_id: books[index]._id });
				result = [...result, ...docs];
			}
			res.json(result);
		}
	);
};

exports.getByAccountWithAuth = (req, res, next) => {
	if (!req.params.account) return next(createError(400));
	if (req.user.role == "normal" && req.user.account != req.params.account)
		return next(createError(401));
	Book.find({ account: req.params.account }, async (err, books) => {
		if (err) return next(err);
		let result = [];
		for (let index = 0; index < books.length; index++) {
			let docs = await Doc.find({ book_id: books[index]._id });
			result = [...result, ...docs];
		}
		res.json(result);
	});
};

exports.getByBook = (req, res, next) => {
	if (req.headers.authorization) return next();
	let { account, identity } = req.params;
	Book.findOne({ account, identity, is_public: true }, (err, book) => {
		if (err) return next(err);
		if (!book) return res.send([]);
		Doc.find({ book_id: book.id }, (err, docs) => {
			if (err) return next(createError(500));
			res.json(docs);
		});
	});
};

exports.getByBookWithAuth = (req, res, next) => {
	if (req.user.role == "normal" && req.user.account != req.params.account)
		return next(createError(401));
	let { account, identity } = req.params;
	Book.findOne({ account, identity }, (err, book) => {
		if (err) return next(err);
		if (!book) return res.send([]);
		Doc.find({ book_id: book.id }, (err, docs) => {
			if (err) return next(createError(500));
			res.json(docs);
		});
	});
};

exports.insert = (req, res, next) => {
	let doc = ({ book_id, account, title, markdown, tag, option } = req.body);
	if (req.user.role == "normal" && req.user.account != account)
		return next(createError(401));
	if (!book_id || !account || !title)
		return res
			.status(400)
			.send({ message: "book_id、account、title是必需的" });
	let _id = ObjectId();
	doc._id = _id;
	Doc.create(doc, err => {
		if (err) return next(err);
		res.send(_id);
	});
};

exports.delete = async (req, res, next) => {
	let list = req.body;
	for (let index = 0; index < list.length; index++) {
		await Doc.findByIdAndDelete(list[index]);
	}
	res.send();
};

exports.update = (req, res, next) => {
	let { title, _id, tag, markdown, option } = req.body;
	if (req.user.role == "normal" && req.user.account != account)
		return next(createError(401));
	if (!_id) return next(createError(400));
	Doc.findByIdAndUpdate(_id, { title, tag, markdown, option }, err => {
		if (err) return next(err);
		res.json();
	});
};
