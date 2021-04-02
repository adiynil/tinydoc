const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvitationCodeSchema = new Schema({
    code: { type: String, required: true },
    account: { type: String, required: true },
    expires_in: { type: Number, default: 7 },
    create_at: { type: Date, default: Date.now() },
    for: { type: String, enum: ["register", "collect"] },
    use_times: Number,

});

module.exports = InvitationCode = mongoose.model("invitation_code", InvitationCodeSchema);