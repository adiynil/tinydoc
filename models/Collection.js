const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    title: { type: String, required: true },
    account: { type: String, required: true },
    invitation_code: { type: String, required: true },
    is_allow_empty: { type: Boolean, default: false },
    is_allow_repeat: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now() },
    expires_in: { type: Number, default: 7 },
    status: { type: String, default: "collecting", enum: ["collecting", "expired"] },
});

module.exports = Collection = mongoose.model("collection", CollectionSchema);