const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
	title: { type: String, required: true },
	identity: { type: String, required: true },
	account: { type: String, required: true },
	description: { type: String, default: "" },
	is_download: { type: Boolean, default: false },
	is_public: { type: Boolean, default: true },
	is_comment: { type: Boolean, default: true },
	label: { type: Array, default: [] },
	comment: { type: Array, default: [] },
	create_at: { type: Date, default: Date.now },
});

module.exports = Book = mongoose.model("book", BookSchema);
