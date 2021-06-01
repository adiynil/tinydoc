const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { ObjectId } = require("mongoose").Types;
const express = require("express");
const DownloadLog = require("../models/DownloadLog");
const Doc = require("../models/Doc");
const CollectDoc = require("../models/CollectDoc");
const router = express.Router();

router.post("/", async (req, res, next) => {
	try {
		let { target_type, target_id, by, account, name } = req.body;
		// 压缩对象
		const archive = archiver("zip", {
			zlib: { level: 9 },
		});
		// 输出流
		let filename = ObjectId();
		const output = fs.createWriteStream("./temp/" + filename + ".zip");

		output.on("close", function () {
			DownloadLog.create({ target_type, target_id, by, account, name });
			res.send(filename);
			// 可以删除
		});
		output.on("end", function () {});
		archive.on("warning", function (err) {});
		archive.on("error", function (err) {
			next(err);
		});
		// 绑定输出流
		archive.pipe(output);
		let list = [];
		if (target_type == "book") {
			list = await Doc.find({ book_id: target_id });
			for (let index = 0; index < list.length; index++) {
				archive.append(list[index].markdown, {
					name: list[index].title + ".md",
				});
			}
		} else if (target_type == "collection") {
			list = await CollectDoc.find({ collection_id: target_id });
			for (let index = 0; index < list.length; index++) {
				archive.append(list[index].content, {
					name: list[index].name + ".md",
				});
			}
		}
		// 结束压缩
		archive.finalize();
	} catch (err) {
		console.log(err);
	}
});

router.get("/file/:filename", (req, res, next) => {
	let { filename } = req.params;
	res.download("./temp/" + filename + ".zip");
});

router.get("/:account", (req, res, next) => {
	let { account } = req.params;
	DownloadLog.find({ account }, (err, logs) => {
		if (err) next(err);
		res.send(logs);
	});
});

module.exports = router;
