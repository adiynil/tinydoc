const index = require("./home");
const users = require("./users");

module.exports = (app) => {
  app.use("/", index);
  app.use("/users", users);
};
