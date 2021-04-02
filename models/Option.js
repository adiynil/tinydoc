const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
    option_name: String,
    option_key: { type: String, lowercase: true },
    option_value: Object,
    remark: String,
});

module.exports = Option = mongoose.model("option", OptionSchema);