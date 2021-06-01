const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("morgan");

const route = require("./routes");
const errHandler = require("./middleware/errHandler");
const db = require("./config/database");
const config = require("./config/base");

const app = express();

// Connect to mongodb
mongoose.set("useFindAndModify", false);
mongoose
	.connect(db.url, db.options)
	.then(() => console.log("MongoDB Connected"))
	.catch(err => console.log(err));

// disable response header 'x-powerd-by'
app.disable("x-powered-by");

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, "public")));

// 使用中间件实现允许跨域
if (config.cors) {
	app.use(require("./middleware/cors"));
}

route(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(errHandler);

module.exports = app;
