var express = require('express');
var Events = require('../db/models').Events;
var Tracks = require('../db/models').Tracks;

var router = express.Router();

/**
 * POST resource for creating analytics records.
 */
router.post('/', async function(req, res, next) {
  try {
    const eventTypeId = await Events.getEventId(req.body.eventType);
    const eventData = req.body.eventData || {};
    let trackId = req.body.trackSlug;

    if (req.body.eventType === Events.EVENT_TYPES.pageView) {
      eventData.duration = req.body.duration;
      trackId = await Tracks.getIdBySlug(req.body.trackSlug); 
    }
    
    const event = await Events.create(trackId, eventTypeId, req.body.userId, eventData);
    res.status(201).send(event);
  } catch(e) {
  	console.log('/analytics err', e);
  	res.status(400).send({
  		error: e,
  	});
  }
});

module.exports = router;