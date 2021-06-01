const express = require("express");
const router = express.Router();

const service = require("../service/doc");
const auth = require("../middleware/auth");

router.get("/all", service.getAll, auth, service.getAllWithAuth);

router.get(
	"/:account",
	service.getByAccount,
	auth,
	service.getByAccountWithAuth
);

router.get("/id/:id", service.getById);

router.get(
	"/:account/:identity",
	service.getByBook,
	auth,
	service.getByBookWithAuth
);

router.delete("/delete", auth, service.delete);

router.post("/insert", auth, service.insert);

router.put("/update", auth, service.update);

module.exports = router;
