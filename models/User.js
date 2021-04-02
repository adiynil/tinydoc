const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    account: { type: String, required: true, lowercase: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "normal", enum: ["normal", "admin", "superadmin"] },
    avatar: String,
    name: String,
    site: String,
    description: String,
    status: { type: String, default: "actived", enum: ["actived", "forbidden", "inactived"] },
    create_at: { type: Date, default: Date.now(), },
    last_login: Date
});

module.exports = User = mongoose.model("user", UserSchema);