const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DownloadLogSchema = new Schema({
	target_type: {
		type: String,
		required: true,
	},
	target_id: { type: String, required: true },
	account: String,
	name: String,
	create_at: { type: Date, default: Date.now },
	by: Object,
});

module.exports = DownloadLog = mongoose.model(
	"download_log",
	DownloadLogSchema
);
