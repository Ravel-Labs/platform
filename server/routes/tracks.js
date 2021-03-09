var express = require("express");
var multer = require("multer");

var UploadService = require("../services/upload");
var Tracks = require("../db/models").Tracks;
var Feedback = require("../db/models").Feedback;

var router = express.Router();

// GET resource for track data.
router.get("/:slug", async function (req, res, next) {
  const track = await Tracks.getTrackBySlug(req.params.slug);
  if (!track || !track.id) {
    res.status(404).send("No track found");
  }
  const trackPrompts = await Feedback.getFeedbackPromptsbyTrackId(track.id);

  track.prompts = trackPrompts.map((x) => ({
    ...x,
    trackId: track.id,
  }));

  res.status(200).send(track);
});

// In-memory handling for form data from incoming multipart/form-data request
var processFile = multer();

// POST resource for track upload.
router.post("/", processFile.single("audio"), async function (req, res, next) {
  try {
    // TODO: Separate separate track upload from track creation
    const track = await UploadService.Upload(req.body, req.file);
    res.status(201).send(track);
  } catch (e) {
    console.log("error", e);
    res.status(400).send(e);
  }
});

router.post("/privacy/:slug", async function (req, res, next) {
  try {
    const track = Tracks.updateTrackPrivacy(
      req.params.slug,
      req.body.isPrivate
    );
  } catch (e) {
    console.log("error", e);
    res.status(400).send(e);
  }
});

module.exports = router;
