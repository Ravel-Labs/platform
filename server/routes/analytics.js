var express = require('express');
var Events = require('../db/models').Events;
var Tracks = require('../db/models').Tracks;
var Sessions = require('../db/models').Sessions;

var router = express.Router();

/**
 * POST resource for creating analytics records.
 */
router.post('/', async function(req, res, next) {
  console.log(" => analytics! ")
  try {
    const eventTypeId = await Events.getEventId(req.body.eventType);
    const eventData = req.body.eventData || {};
    let trackId = req.body.trackId || null;
    let sessionId = req.body.sessionId || null;
    const newSession = req.body.newSession;

    if (req.body.eventType === Events.EVENT_TYPES.pageView) {
      eventData.duration = req.body.duration;
      trackId = await Tracks.getIdBySlug(req.body.trackSlug);
    }
        
    if (newSession) {
      const session = await Sessions.create(trackId, req.body.userId);
      sessionId = session[0].id;
      console.log(sessionId);
    }

    const event = await Events.create(trackId, eventTypeId, sessionId, eventData);
    res.status(201).send(event[0]);
  } catch(e) {
  	console.log('/analytics err', e);
  	res.status(400).send({
  		error: e,
  	});
  }
});

module.exports = router;