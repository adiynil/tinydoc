const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const CollectDoc = require("../models/CollectDoc");
const Collection = require("../models/Collection");

router.get("/account/:account", auth, getByAccount);

router.get("/code/:code", getByCode);

router.post("/insert", auth, insert);

router.put("/update", auth, update);

router.delete("/delete", auth, remove);

module.exports = router;

function getByAccount(req, res, next) {
	let { account } = req.params;
	Collection.find({ account }, (err, collections) => {
		if (err) next(err);
		res.send(collections);
	});
}

function getByCode(req, res, next) {
	let { code } = req.params;
	Collection.findOne({ code }, (err, collection) => {
		if (err) next(err);
		res.send(collection);
	});
}

function insert(req, res, next) {
	let { title, account, code, is_allow_empty, is_allow_repeat, expires_in } =
		req.body;
	Collection.create(
		{
			title,
			account,
			code,
			is_allow_empty,
			is_allow_repeat,
			expires_in,
		},
		err => {
			if (err) next(err);
			res.send(code);
		}
	);
}

function update(req, res, next) {
	let { _id, title, is_allow_empty, is_allow_repeat, expires_in } = req.body;
	Collection.findByIdAndUpdate(
		_id,
		{
			title,
			is_allow_empty,
			is_allow_repeat,
			expires_in,
		},
		err => {
			if (err) next(err);
			res.send();
		}
	);
}

async function remove(req, res, next) {
	let list = req.body;
	for (let index = 0; index < list.length; index++) {
		await Collection.findByIdAndDelete(list[index]);
		await CollectDoc.deleteMany({ collection_id: list[index] });
	}
	res.send();
}
