const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
    book_id: { type: String, required: true },
    title: { type: String, required: true },

});

module.exports = Label = mongoose.model("label", LabelSchema);