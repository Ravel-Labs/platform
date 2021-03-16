var express = require("express");
var AuthService = require("../services/auth");
var config = require("../config");
var router = express.Router();

const dayMs = 24 * 60 * 60 * 1000;
// TODO: Update before deploying
const tokenLengthMs = 30 * dayMs;
// const testTokenLengthMs = 60 * 1000

function setAuthCookie(res, token) {
  console.log("cookie name", AuthService.AUTH_TOKEN_COOKIE);
  res.cookie(AuthService.AUTH_TOKEN_COOKIE, token, {
    expires: new Date(Date.now() + tokenLengthMs),
    secure: false, // set to true if your using https
    // secure: config.nodeEnv === "production", // set to true if your using https
    httpOnly: true,
  });
}

// Signup route -- create a new user, return token.
router.post("/signup", async function (req, res) {
  const { email, username, displayName, password, code } = req.body;
  const userFields = { email, username, displayName, password };

  let userInfo = null;
  try {
    userInfo = await AuthService.Signup(userFields, code);
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
