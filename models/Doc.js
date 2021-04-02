const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocSchema = new Schema({
    title: { type: String, required: true },
    book_id: { type: String, required: true },
    account: { type: String, required: true },
    markdown: String,
    create_at: { type: Date, default: Date.now() },
    last_modified: Date
});

module.exports = Doc = mongoose.model("doc", DocSchema);