const gravatar = require("gravatar");

const Comment = require("../models/Comment");

exports.get = (req, res, next) => {
	let { id: book_id } = req.params;
	Comment.find({ book_id }, (err, comments) => {
		if (err) return next(err);
		res.send(comments);
	});
};

exports.delete = async (req, res, next) => {
	let list = req.body;
	for (let index = 0; index < list.length; index++) {
		await Comment.findByIdAndDelete(list[index]);
	}
	res.send();
};

exports.insert = (req, res, next) => {
	let { book_id, name, email, site, content } = req.body;
	if (!book_id || !name)
		return res.status(400).json({ message: "book_id、name是必须的" });
	const avatar = gravatar.url(email, {
		s: "200",
		r: "pg",
		d: "mm",
		protocol: "https",
	});
	let comment = { book_id, name, email, site, avatar, content };
	Comment.create(comment, err => {
		if (err) return next(err);
		res.send({ message: "OK" });
	});
};
