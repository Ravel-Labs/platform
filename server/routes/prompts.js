var express = require("express");
var router = express.Router();

var FeedbackPrompts = require("../db/models").FeedbackPrompts;

// GET resource for available feedback prompts.
router.get("/", async function (req, res) {
  const prompts = await FeedbackPrompts.list();
  res.status(200).send(prompts);
});

module.exports = router;
