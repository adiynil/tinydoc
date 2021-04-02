const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollectDocSchema = new Schema({
    collection_id: { type: String, required: true },
    name: { type: String, required: true },
    remark: String,
    content: String,
    create_at: { type: Date, default: Date.now() },
});

module.exports = CollectDoc = mongoose.model("collect_doc", CollectDocSchema);