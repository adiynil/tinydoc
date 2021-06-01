const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	book_id: { type: String, required: true },
	name: { type: String, required: true },
	email: String,
	avatar: String,
	site: String,
	content: String,
	create_at: { type: Date, default: Date.now },
});

module.exports = Comment = mongoose.model("comment", CommentSchema);