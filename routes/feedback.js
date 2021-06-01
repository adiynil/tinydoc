const express = require("express");
const router = express.Router();

const mailer = require("../libs/mail");

router.post("/", (req, res) => {
	mailer.sendFeedback(req.body);
	res.send();
});

module.exports = router;
