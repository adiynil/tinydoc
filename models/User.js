const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	account: { type: String, required: true, lowercase: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	role: {
		type: String,
		default: "normal",
		enum: ["normal", "admin"],
	},
	avatar: String,
	name: { type: String, default: "" },
	site: { type: String, default: "" },
	description: { type: String, default: "" },
	status: {
		type: String,
		default: "actived",
		enum: ["actived", "forbidden"],
	},
	option: {
		is_public_email: { type: Boolean, default: false },
		is_email_active: { type: Boolean, default: false },
		is_name_public: { type: Boolean, default: false },
	},
	create_at: { type: Date, default: Date.now },
	last_login: { type: Date, default: Date.now },
});

module.exports = User = mongoose.model("user", UserSchema);
