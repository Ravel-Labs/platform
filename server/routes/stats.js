var express = require("express");
var Stats = require("../db/models").Stats;
var Tracks = require("../db/models").Tracks;

var router = express.Router();

router.post("/:slug", async function (req, res, next) {
  try {
    const track = await Tracks.getTrackBySlug(req.body.trackSlug);
    if (!track) {
      return res
        .status(404)
        .send(`No track found for slug ${req.body.trackSlug}`);
    }
    // TODO: Resolve query
    // const playbackStats = await Stats.getPlaybackStatsByTrackId(track.id);
    const feedbackStats = await Stats.getFeedbackStatsByTrackId(track.id);
    const resData = {
      track,
      // playbackStats,
      feedbackStats,
    };
    res.status(201).send(resData);
  } catch (e) {
    console.log("error", e);
    res.status(400).send(e);
  }
});

module.exports = router;
