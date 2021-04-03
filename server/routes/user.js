var express = require("express");
var multer = require("multer");
var router = express.Router();

var UploadService = require("../services/upload");
var User = require("../db/models").User;
var Feedback = require("../db/models").Feedback;
var tokenMiddleware = require("../middleware/token");


// GET resource for any user, intended to return public profile information.
router.get("/:username", async function (req, res, next) {
  const user = await User.getByUsername(req.params.username, [
    "displayName",
    "createdAt",
    "username",
    "bio",
    "city",
    "country"
  ]);
  res.status(200).send(user);
});

var processFile = multer();

router.post(
  "/update-profile-image",
  tokenMiddleware.requireUser,
  processFile.single("file"),
  async function (req, res, next) {
    try {
      const user = await UploadService.UserProfileImageUpload(
        req.file, 
        req.userId, 
        { resize: { width: 1000, height: 1000 }});
      res.status(201).send(user);
    } catch(e) {
      console.error(e);
    }
  }
);

router.get("/profile-stats/:username", async function (req, res, next) {
  try {
    const feedbackCount = await Feedback.getFeedbackCountByUsername(req.params.username);
    const avgFeedbackRating = await Feedback.getAvgFeedbackRatingByUsername(req.params.username);
    const profileStats = {
      ...feedbackCount,
      ...avgFeedbackRating
    };
    res.status(200).send(profileStats);
  } catch(e) {
    console.error(e);
  }
})

// GET resource for the currently logged in user.
router.get("/", async function (req, res, next) {
  const { userEmail } = req;
  if (!userEmail) {
    return res.status(200).send(null);
  }

  const user = await User.getByEmail(userEmail);
  res.status(200).send(user);
});

module.exports = router;
