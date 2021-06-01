const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const CollectDoc = require("../models/CollectDoc");
const Collection = require("../models/Collection");

router.get("/id/:id", auth, getById);

router.post("/insert", auth, insert);

router.delete("/delete", auth, remove);

module.exports = router;

function getById(req, res, next) {
	let { id } = req.params;
	CollectDoc.find({ collection_id: id }, (err, data) => {
		if (err) next(err);
		res.send(data);
	});
}

async function insert(req, res, next) {
	let { collection_id, name, remark, content } = req.body;
	let collection = await Collection.findById(collection_id);
	let exist = await CollectDoc.findOne({ name, collection_id });
	if (!collection.is_allow_repeat && exist)
		return res.status(400).send({ message: "不可以重复提交" });
	CollectDoc.create(
		{
			collection_id,
			name,
			remark,
			content,
		},
		async err => {
			if (err) next(err);
			await Collection.findByIdAndUpdate(collection_id, {
				times: collection.times + 1,
			});
			res.send();
		}
	);
}

async function remove(req, res, next) {
	let list = req.body;
	for (let index = 0; index < list.length; index++) {
		await CollectDoc.findByIdAndDelete(list[index]);
	}
	res.send();
}
