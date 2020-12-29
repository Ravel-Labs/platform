var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {
  const { userEmail }  = req; 
  console.log(`Received feedback from user ${userEmail}`, req.body);
  // TODO: create feedback record in DB.

  res.status(201).send();
});

module.exports = router;