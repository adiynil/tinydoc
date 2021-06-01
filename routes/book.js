const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Book = require("../models/Book");
const service = require("../service/book");

router.get("/all", service.getAll, auth, service.getAllWithAuth);

router.get("/get/:id", async (req, res, next) => {
	let { id } = req.params;
	let book = await Book.findById(id);
	res.send(book);
});

router.get(
	"/:account",
	service.getByAccount,
	auth,
	service.getByAccountWithAuth
);

router.get("/:account/:identity", service.getOne, auth, service.getOneWithAuth);

router.post("/:account/:identity", auth, service.insert);

router.delete("/:id", auth, service.delete);

router.put("/:id", auth, service.update);

module.exports = router;
