const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true },
    identity: { type: String, required: true },
    account: { type: String, required: true },
    description: String,
    is_download: { type: Boolean, default: false },
    is_public: { type: Boolean, default: true },
    is_comment: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now() },
});

module.exports = Book = mongoose.model("book", BookSchema);