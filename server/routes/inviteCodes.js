var express = require("express");
var AuthService = require("../services/auth");
var config = require("../config");
var User = require("../db/models").User;
var Invites = require("../db/models").Invites;
var router = express.Router();

// Create invite code for the logged in user.
router.post("/", async function (req, res, next) {
  const userInvitesRemaining = await User.getUserInvitesRemaining(
    req.userId
  );
  if (userInvitesRemaining <= 0) {
    return res.status(400).send("User has no invites remaining.");
  }

  let inviteCode = null;
  try {
    inviteCode = await Invites.create(req.userId, User.ROLES.betaUser);
  } catch (e) {
    console.error("/create-code err", e);
    return res.status(400).send(e);
  }

  if (inviteCode) {
    await User.decrementInvitesRemaining(req.userId);
    return res.status(200).send(inviteCode);
  }

  return res.status(400).send("Unable to create invite code");
});

// Get invite codes for the logged in user.
router.get("/", async function (req, res, next) {
  try {
    const inviteCodes = await Invites.getInviteCodesByUserId(req.userId);
    res.status(200).send(inviteCodes);
  } catch (e) {
    console.error("/invite-codes err", e);
    res.status(400).send(e);
  }
});

module.exports = router;
