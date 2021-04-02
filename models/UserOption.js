const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserOptionSchema = new Schema({
    account: { type: String, required: true, lowercase: true },
    is_public_email: { type: Boolean, default: false },
    is_email_active: { type: Boolean, default: false },
    is_name_public: { type: Boolean, default: false },
});

module.exports = UserOption = mongoose.model("user_option", UserOptionSchema);