var express = require('express');
var router = express.Router();
var Invites = require('../db/models').Invites;

// TODO: users resource endpoints
router.get('/invite-codes', async function(req, res, next) {
  try {
    const inviteCodes = Invites.getInviteCodesByUserId(req.body.userId);
  } catch(e) {
    console.log("/invite-codes err", e);
    res.status(400).send(e);
  }
  res.status(200).send(inviteCodes);
})

module.exports = router;