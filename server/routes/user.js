var express = require("express");
var router = express.Router();

var User = require("../db/models").User;

// GET resource for any user, intended to return public profile information.
router.get("/:username", async function (req, res, next) {
  const user = await User.getByUsername(req.params.username, [
    "displayName",
    "createdAt",
  ]);
  res.status(200).send(user);
});

// GET resource for the currently logged in user.
router.get("/", async function (req, res, next) {
  const { userEmail } = req;
  if (!userEmail) {
    return res.status(200).send(null);
  }

  const user = await User.getByEmail(userEmail);
  res.status(200).send(user);
});

module.exports = router;
