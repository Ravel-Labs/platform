var express = require('express');
var Events = require('../db/models').Events;

var router = express.Router();

/**
 * POST resource for creating analytics records.
 */
router.post('/', function(req, res, next) {
  try {
  	const event = Events.create(req.body.trackId, req.body.eventType, req.body.userId, req.body.eventData);
  	console.log("body ", req.body);
    res.status(201).send(event);
  } catch(e) {
  	console.log('/analytics err', e);
  	res.status(400).send{
  		error: e,
  	}
  }
});

module.exports = router;