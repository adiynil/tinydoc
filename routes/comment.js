const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const service = require("../service/comment");

router.get("/test", (req, res) => {
	res.send({ message: "OK" });
});

router.get("/get/:id", service.get);

router.post("/add", service.insert);

router.delete("/delete", service.delete);

module.exports = router;
