var express = require('express');
var Stats = require('../db/models').Stats;
var Tracks = require('../db/models').Tracks;

var router = express.Router();

router.post('/:slug', async function(req, res, next) {
	try {
    const trackId = await Tracks.getIdBySlug(req.body.trackSlug);
    const feedbackStats = await Stats.getFeedbackStatsbyTrackId(trackId);
    res.status(201).send(feedbackStats);
	} catch(e) {
		console.log("error", e);
		res.status(400).send(e);
	}
})

module.exports = router;