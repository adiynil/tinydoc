const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Option = require("../models/Option");

router.get("/get", getAll);

router.post("/insert", auth, insert);

router.put("/update", auth, update);

router.delete("/delete/:key", auth, remove);

module.exports = router;

async function getAll(req, res, next) {
	let options = await Option.find();
	res.send(options);
}
async function insert(req, res, next) {
	let { name, key, value, remark } = req.body;
	let exist = await Option.findOne({ key });
	if (exist) return res.status(400).send({ message: "key不能重复" });
	await Option.create({ name, key, value, remark });
	res.send();
}
async function update(req, res, next) {
	let data = req.body,
		{ key } = req.body;
	await Option.findOneAndUpdate({ key }, data);
	res.send();
}
async function remove(req, res, next) {
	let { key } = req.params;
	await Option.findOneAndDelete({ key });
	res.send();
}
