var express = require('express');
var Events = require('../db/models').Events;
var Tracks = require('../db/models').Tracks;

var router = express.Router();

/**
 * POST resource for creating analytics records.
 */
router.post('/', async function(req, res, next) {
  try {
    const eventId = await Events.getEventId(req.body.eventType);
    let eventRec;
    if (eventId == 5) {
      const eventData = {'duration': req.body.duration};
      const trackId = await Tracks.getIdBySlug(req.body.trackSlug);
      eventRec = await Events.create(trackId, eventId, req.body.userId, eventData);
    } else {
      eventRec = await Events.create(req.body.trackId, eventId, req.body.userId, req.body.eventData);
    }

  	console.log("body ", req.body);
    res.status(201).send(eventRec);
  } catch(e) {
  	console.log('/analytics err', e);
  	res.status(400).send({
  		error: e,
  	});
  }
});

module.exports = router;