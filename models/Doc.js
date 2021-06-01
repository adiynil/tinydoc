const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocSchema = new Schema(
	{
		title: { type: String, required: true },
		book_id: { type: String, required: true },
		account: { type: String, required: true },
		markdown: { type: String, default: "" },
		tag: { type: Array, default: [] },
		option: {
			is_download: { type: Boolean, default: true },
			toc: { type: Boolean, default: true },
			tocExpand: { type: Boolean, default: true },
		},
	},
	{ timestamps: { createdAt: "create_at", updatedAt: "last_modified" } }
);

module.exports = Doc = mongoose.model("doc", DocSchema);
