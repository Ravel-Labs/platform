var express = require("express");
var Stats = require("../db/models").Stats;
var Tracks = require("../db/models").Tracks;

var router = express.Router();

router.post("/:slug", async function (req, res, next) {
  try {
    const trackId = await Tracks.getIdBySlug(req.body.trackSlug);
    if (trackId === null || trackId === undefined) {
      return res.status(404).send(`No track found for slug ${req.body.trackSlug}`);
    }
    const playbackStats = await Stats.getPlaybackStatsByTrackId(trackId);
    const feedbackStats = await Stats.getFeedbackStatsByTrackId(trackId);
    const stats = {
      playbackStats,
      feedbackStats,
    };
    console.log(stats);
    res.status(201).send(stats);
  } catch (e) {
    console.log("error", e);
    res.status(400).send(e);
  }
});

module.exports = router;
