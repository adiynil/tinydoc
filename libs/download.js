const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { ObjectId } = require("mongoose").Types;

module.exports = (req, res, next) => {
	// 压缩对象
	const archive = archiver("zip", {
		zlib: { level: 9 },
	});
	// 输出流
	let filename = ObjectId();
	const output = fs.createWriteStream(
		path.join(__dirname, filename + ".zip")
	);
	// 绑定输出流
	archive.pipe(output);

	output.on("close", function () {
		console.log(archive.pointer() + " total bytes");
		console.log(
			"archiver has been finalized and the output file descriptor has closed."
		);
		res.download(path.join(__dirname, "example.zip"));
	});
	output.on("end", function () {});
	archive.on("warning", function (err) {});
	archive.on("error", function (err) {
		next(err);
	});

	archive.append("string cheese!", { name: "file2.txt" });
	archive.finalize();

	// const file1 = __dirname + "/crypto.js";
	// archive.append(fs.createReadStream(file1), { name: "file1.js" });
	// if (req.query.id) archive.append(req.query.id, { name: "req.query.md" });
	// const buffer3 = Buffer.from("buff it!");
	// archive.append(buffer3, { name: "file3.txt" });
};
