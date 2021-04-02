const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DownloadLogSchema = new Schema({
    target_type: { type: String, required: true, enum: ["book", "doc"] },
    target_id: { type: String, required: true },
    create_at: { type: Date, default: Date.now() },
    by: Object,

});

module.exports = DownloadLog = mongoose.model("download_log", DownloadLogSchema);