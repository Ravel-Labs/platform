var express = require("express");
var router = express.Router();

var Comments = require("../db/models").Comments;

router.post("/", async function (req, res, next) {
  const { trackId, text } = req.body;
  const userId = req.userId;
  try {
    const comment = await Comments.create(userId, trackId, text);
    res.status(201).send(comment);
  } catch (e) {
    console.error("error", e);
    res.status(400).send(e);
  }
});

router.patch("/comment/:id", async function (req, res, next) {
  try {
    const updatedComment = await Comments.updateById(req.params.id, req.body);
    res.status(201).send(updatedComment);
  } catch (e) {
    console.error("error", e);
    res.status(400).send(e);
  }
});

router.delete("/comment/:id", async function (req, res, next) {
  try {
    const deletedComment = await Comments.deleteById(req.params.id);
    res.status(200).send(`deleted comment with id ${req.params.id}`);
  } catch (e) {
    console.error("error", e);
    res.status(400).send(e);
  }
});

module.exports = router;