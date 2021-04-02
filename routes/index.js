const user = require("./user");
const book = require("./book");

module.exports = (app) => {
    app.use("/user", user);
    app.use("/book", book);
};