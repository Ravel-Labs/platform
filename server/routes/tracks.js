var express = require("express");
var multer = require("multer");

var AuthService = require("../services/auth");
var UploadService = require("../services/upload");
var Feedback = require("../db/models").Feedback;
var TrackCredits = require("../db/models").TrackCredits;
var Tracks = require("../db/models").Tracks;
var User = require("../db/models").User;
var tokenMiddleware = require("../middleware/token");

var router = express.Router();

router.get("/featured", async function (req, res, next) {
  const tracks = await Tracks.getFeaturedTracks();
  return res.status(200).send(tracks);
});

// GET resource for track data.
router.get("/:slug", async function (req, res, next) {
  const track = await Tracks.getTrackBySlug(req.params.slug);
  if (!track || !track.id) {
    res.status(404).send("No track found");
  }

  const { hasAccess } = await AuthService.validateAccess(
    req.userId,
    req.params.slug
  );
  if (!hasAccess) {
    // const msg = "User does not have access to view this track";
    // throw Error(msg);
    return res.status(404).send("User does not have access to view this track");
  }

  // TODO: We can combine all these queries into one at the DB level.
  const trackPrompts = await Feedback.getFeedbackPromptsbyTrackId(track.id);
  track.prompts = trackPrompts.map((x) => ({
    ...x,
    trackId: track.id,
  }));

  const userId = await TrackCredits.getUserIdbyTrackId(track.id);
  const user = await User.getById(userId, ["displayName"]);
  track.artist = user.displayName;

  const feedback = await Feedback.filterForTrackIdUserId(track.id, userId);
  track.userFeedback = feedback;

  res.status(200).send(track);
});

// In-memory handling for form data from incoming multipart/form-data request
var processFile = multer();

// POST resource for track upload.
router.post(
  "/",
  tokenMiddleware.requireUser,
  processFile.single("audio"),
  async function (req, res, next) {
    try {
      // TODO: Separate separate track upload from track creation
      const track = await UploadService.Upload(req.body, req.file, req.userId);
      res.status(201).send(track);
    } catch (e) {
      console.log("error", e);
      res.status(400).send(e);
    }
  }
);

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
