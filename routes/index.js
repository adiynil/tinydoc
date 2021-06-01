const user = require("./user");
const book = require("./book");
const doc = require("./doc");
const comment = require("./comment");
const feedback = require("./feedback");
const download = require("./download");
const collection = require("./collection");
const collectdoc = require("./collectdoc");
const option = require("./option");

module.exports = app => {
	app.use("/user", user);
	app.use("/book", book);
	app.use("/doc", doc);
	app.use("/comment", comment);
	app.use("/feedback", feedback);
	app.use("/download", download);
	app.use("/collection", collection);
	app.use("/collectdoc", collectdoc);
	app.use("/option", option);
};
