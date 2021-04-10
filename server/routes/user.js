var express = require("express");
var multer = require("multer");
var router = express.Router();

var UploadService = require("../services/upload");
var User = require("../db/models").User;
var Feedback = require("../db/models").Feedback;
var Links = require("../db/models").Links;
var tokenMiddleware = require("../middleware/token");

// GET resource for any user, intended to return public profile information.
router.get("/:username", async function (req, res, next) {
  const user = await User.getByUsername(req.params.username, [
    "displayName",
    "createdAt",
    "username",
    "bio",
    "city",
    "country",
    "imagePath",
  ]);
  const linkFields = ["links.id AS linkId", "url", "type", "userId"];
  const links = await Links.getByUsername(req.params.username, linkFields);
  const profileUser = {
    ...user,
    // TODO: support multiple links.
    link: links.pop(),
  };
  console.log(profileUser);
  res.status(200).send(profileUser);
});

var processFile = multer();

router.patch(
  "/:username",
  tokenMiddleware.requireUser,
  processFile.single("file"),
  async function (req, res, next) {
    // If we have no payload, return an error.
    if (!req.body) {
      return res.status(400).send();
    }

    // Link and file (image) require special handling.
    const { link, file, ...userFields } = req.body;
    let userObject = { ...userFields };

    try {
      if (req.file) {
        const imagePath = await UploadService.UserProfileImageUpload(
          req.file,
          req.userId,
          { resize: { width: 1000, height: 1000 } }
        );
        userObject = { ...userObject, imagePath: imagePath };
      }

      // TODO: Eventually we want to support multiple links.
      let links = [];
      if (link) {
        // TODO eliminate duplication here
        const linkFields = ["links.id AS linkId", "url", "type", "userId"];
        const userLinks = await Links.getByUsername(
          req.params.username,
          linkFields
        );

        let linkExists = false;
        userLinks.forEach((userLink) => {
          if (userLink.url === link) {
            linkExists = true;
            links.push(userLink);
          }
        });

        if (!linkExists) {
          links = await Links.bulkCreate([
            { url: link, type: Links.LINK_TYPES.website, userId: req.userId },
          ]);
        }
      }

      const updatedUser = await User.updateUser(req.userId, userObject);

      res.status(200).send({
        ...updatedUser,
        // TODO: support multiple links
        link: links.pop(),
      });
    } catch (e) {
      console.error(e);
    }
  }
);

// router.post(
//   "/update-profile-image",
//   tokenMiddleware.requireUser,
//   processFile.single("file"),
//   async function (req, res, next) {
//     try {
//       const user = await UploadService.UserProfileImageUpload(
//         req.file,
//         req.userId,
//         { resize: { width: 1000, height: 1000 }});
//       res.status(201).send(user);
//     } catch(e) {
//       console.error(e);
//     }
//   }
// );

router.get("/profile-stats/:username", async function (req, res, next) {
  try {
    const feedbackCount = await Feedback.getFeedbackCountByUsername(
      req.params.username
    );
    const avgFeedbackRating = await Feedback.getAvgFeedbackRatingByUsername(
      req.params.username
    );
    const profileStats = {
      ...feedbackCount,
      ...avgFeedbackRating,
    };
    res.status(200).send(profileStats);
  } catch (e) {
    console.error(e);
  }
});

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
