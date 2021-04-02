const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const service = require("../service/book");

router.get("/:identity", service.getOne);

router.get("/:identity", service.getOne);

router.get("/:identity", service.getOne);

router.get("/:identity", service.getOne);

router.get("/:identity", service.getOne);

router.get("/:identity", service.getOne);

module.exports = router;