var express = require("express");
var AuthService = require("../services/auth");
var config = require("../config");
var User = require("../db/models").User;
var Invites = require("../db/models").Invites;
var router = express.Router();

const dayMs = 24 * 60 * 60 * 1000;
// TODO: Update before deploying
const tokenLengthMs = 30 * dayMs;
// const testTokenLengthMs = 60 * 1000

function setAuthCookie(res, token) {
  res.cookie(AuthService.AUTH_TOKEN_COOKIE, token, {
    expires: new Date(Date.now() + tokenLengthMs),
    secure: config.nodeEnv === "production", // set to true if your using https
    httpOnly: true,
  });
}

router.post("/create-code", async function (req, res, next) {
  try {
    const userInvitesRemaining = await User.getUserInvitesRemaining(
      req.body.userId
    );
    console.log(userInvitesRemaining);
    if (userInvitesRemaining > 0) {
      const inviteCode = await Invites.create(
        req.body.userId,
        User.ROLES.betaUser
      );
      console.log(inviteCode);
      const user = await User.decrementInvitesRemaining(req.body.userId);
      res.status(200).send(inviteCode);
    } else {
      console.log("/create-code: user has no codes to give");
    }
  } catch (e) {
    console.log("/create-code err", e);
    res.status(400).send(e);
  }
});

router.get("/invite-codes", async function (req, res, next) {
  try {
    const inviteCodes = await Invites.getInviteCodesByUserId(req.body.userId);
    console.log(inviteCodes);
    res.status(200).send(inviteCodes);
  } catch (e) {
    console.log("/invite-codes err", e);
    res.status(400).send(e);
  }
});

// Signup route -- create a new user, return token.
router.post("/signup", async function (req, res) {
  const { email, username, password, code } = req.body;

  let userInfo = null;
  try {
    userInfo = await AuthService.Signup(email, username, password, code);
  } catch (e) {
    console.log("/signup err", e);
    res.status(400).send({
      errorMessage: e.message,
    });
  }

  if (!userInfo) {
    res.status(400).send({ errorMessage: "Unable to create new user." });
  }

  const { user, token } = userInfo;
  setAuthCookie(res, token);
  return res.status(201).send({
    user,
    token,
  });
});

// Login route -- validate credentials, return token + user info.
router.post("/login", async function (req, res) {
  const { email, password } = req.body;
  try {
    const { token, user } = await AuthService.Login(email, password);
    setAuthCookie(res, token);
    return res.status(200).send({
      user,
      token,
    });
  } catch (e) {
    res.status(401).send({
      errorMessage: e.message,
    });
  }
});

// Logout route -- remove cookie with jwt value.
router.post("/logout", async function (req, res) {
  setAuthCookie(res, "");
  return res.status(200).send();
});

module.exports = router;
