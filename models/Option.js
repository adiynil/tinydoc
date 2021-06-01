const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
    name: String,
    key: { type: String, lowercase: true },
    value: Object,
    remark: String,
});

module.exports = Option = mongoose.model("option", OptionSchema);