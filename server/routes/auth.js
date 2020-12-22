var express = require('express');
var router = express.Router();

// Signup route -- create a new user, return token.
router.post('/signup', function(req, res) {
  // TODO: validate uniqueness & proper values.
  // TODO: create user in DB.
  // TODO: create jwt to include in response.

  res.status(201).send({
    user: {
      username: req.body.username,
      email: req.body.email,
      id: 12,
      displayName: "Display Name",
    },
    token: "TODO",
  });
});

// Login route -- validate credentials, return token + user info.
router.post('/login', function(req, res) {
  const { email } = req.body;
  // TODO: lookup user in DB by email.
  // TODO: validate password
  // TODO: create jwt to include in response.

  res.status(200).send({
    user: {
      email,
      username: "todo_username",
      id: 12,
      displayName: "Display Name",
    },
    token: "TODO",
  });
});

module.exports = router;