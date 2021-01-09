var express = require('express');

var router = express.Router();

/**
 * POST resource for creating analytics records.
 */
router.post('/', function(req, res, next) {
  console.log("body ", req.body)
  
  // TODO: create analytics records
  res.status(201).send();
});

module.exports = router;