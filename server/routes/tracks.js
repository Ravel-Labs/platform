var express = require("express");
var multer = require("multer");

var AuthService = require("../services/auth");
var UploadService = require("../services/upload");
var DeleteService = require("../services/delete");
var Comments  = require("../db/models").Comments;
var Feedback = require("../db/models").Feedback;
var TrackCredits = require("../db/models").TrackCredits;
var Tracks = require("../db/models").Tracks;
var User = require("../db/models").User;
var tokenMiddleware = require("../middleware/token");

var router = express.Router();

router.get("/featured", async function (req, res, next) {
  // For featured tracks, we only want to include private tracks if they are from users
  // that the logged-in user can follow. Currently, that's the logged in user themself,
  // or the user that referred the logged-in user
  const privateTrackUserIds = [];
  if (req.userId !== undefined && req.userId !== null) {
    privateTrackUserIds.push(req.userId);
    const userFields = await User.getById(req.userId, ["referrerId"]);
    if (userFields.referrerId !== null) {
      privateTrackUserIds.push(userFields.referrerId);
    }
  }

  const tracks = await Tracks.getFeaturedTracks(privateTrackUserIds);
  return res.status(200).send(tracks);
});

// GET resource for tracks from a specific user
router.get("/user/:username", async function (req, res, next) {
  const tracks = await Tracks.filterByUsername(req.params.username);
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

  const artistUserId = await TrackCredits.getUserIdbyTrackId(track.id);
  const artistUser = await User.getById(artistUserId, [
    "displayName",
    "username",
  ]);
  track.artist = artistUser.displayName;
  track.username = artistUser.username;

  if (req.userId !== undefined) {
    const feedback = await Feedback.filterForTrackIdUserId(
      track.id,
      req.userId
    );
    track.userFeedback = feedback;
  }

  res.status(200).send(track);
});

router.get("/:slug/comments", async function (req, res, next) {
  try {
    const comments = await Comments.getByTrackSlug(req.params.slug);
    res.status(200).send(comments);
  } catch (e) {
    console.error("error", e);
    res.status(400).send(e);
  }
});

// In-memory handling for form data from incoming multipart/form-data request
var processFile = multer();

// POST resource for track upload.
router.post(
  "/",
  tokenMiddleware.requireUser,
  processFile.fields([
    { name: "audio", maxCount: 1 },
    { name: "artwork", maxCount: 1 },
  ]),
  async function (req, res, next) {
    if (!req.files.audio.length) {
      res.status(400).send("Must provide an audio file to upload.");
    }
    const audio = req.files.audio[0];
    let artwork = null;
    if (req.files.artwork && req.files.artwork.length) {
      artwork = req.files.artwork[0];
    }

    try {
      // TODO: Separate separate track upload from track creation
      const track = await UploadService.Upload(
        req.body,
        audio,
        artwork,
        req.userId
      );
      res.status(201).send(track);
    } catch (e) {
      console.log("error", e);
      res.status(400).send(e);
    }
  }
);

router.delete("/:slug", async function (req, res, next) {
  try {
    const deletedTrack = await DeleteService.Delete(req.params.slug);
    res.status(200).send(`deleted track with slug ${req.params.slug}`);
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
