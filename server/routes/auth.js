var express = require('express');
var AuthService = require('../services/auth');
var config = require('../config');
var router = express.Router();

const dayMs = 24 * 60 * 60 * 1000
// TODO: Update before deploying
const tokenLengthMs = 30 * dayMs
// const testTokenLengthMs = 60 * 1000

function setAuthCookie(res, token) {
  res.cookie(AuthService.AUTH_TOKEN_COOKIE, token, {
    expires: new Date(Date.now() + tokenLengthMs),
    secure: config.nodeEnv === 'production', // set to true if your using https
    httpOnly: true,
  });
}

// Signup route -- create a new user, return token.
router.post('/signup', async function(req, res) {
  const { email, username, password } = req.body;

  try {
    const { token, user } = await AuthService.Signup(email, username, password)
    setAuthCookie(res, token);
    return res.status(201).send({
      user,
      token,
    });
  } catch(e) {
    console.log("/signup err", e)
    res.status(400).send({
      error: e,
    });
  }
});

// Login route -- validate credentials, return token + user info.
router.post('/login', async function(req, res) {
  const { email, password } = req.body;

  try {
    const { token, user } = await AuthService.Login(email, password)
    setAuthCookie(res, token);
    return res.status(200).send({
      user,
      token,
    });
  } catch(e) {
    console.log("/login err", e)
    res.status(401).send({
      error: e,
    });
  }
});

module.exports = router;