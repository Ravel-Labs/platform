var express = require('express');
var router = express.Router();

// Signup route -- create a new user.
router.post('/', function(req, res) {
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
  });
});

module.exports = router;