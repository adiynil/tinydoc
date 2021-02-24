var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  try {
    // return list
    // console.log(req);
    res.status(200).json(req.headers);
  } catch (error) {
    // log error
    res.status(404).send();
  }
});

router.get("/:account", function (req, res, next) {
  try {
    // return user
  } catch (error) {
    // log error
    res.status(404).send();
  }
});

router.post("/", (req, res, next) => {
  try {
    // add one
  } catch (error) {
    // log error
    res.status(500).send();
  }
});

router.delete("/:account", (req, res, next) => {
  try {
    // delete one
  } catch (error) {
    // log error
    res.status(500).send();
  }
});

router.put("/delete", (req, res, next) => {
  try {
    // delete some
  } catch (error) {
    // log error
    res.status(500).send();
  }
});

router.put("/:account", (req, res, next) => {
  try {
    // update one
  } catch (error) {
    // log error
    res.status(500).send();
  }
});

module.exports = router;
