const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const service = require("../service/user");

router.post("/register", service.register);

router.post("/login", service.login);

router.get("/current", auth, (req, res, next) => {
    res.json(req.user);
});

router.get("/list", auth, service.getAll);

router.delete("/delete", auth, service.delete);

router.get("/emailvalid", service.validemail);

router.post("/insert", auth, service.insert);

router.get("/:account", auth, service.getOne);

router.delete("/:account", auth, service.deleteOne);

router.put("/:account", auth, service.updateOne);

module.exports = router;