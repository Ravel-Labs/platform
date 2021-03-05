var express = require('express');
var multer = require('multer')

var UploadService = require('../services/upload');
var Tracks = require('../db/models').Tracks;
var Feedback = require('../db/models').Feedback;

var router = express.Router();


// GET resource for track data.
router.get('/:slug', async function(req, res, next) {

  const dummyTrack = await Tracks.getTrackBySlug(req.params.slug);
  const dummyTrackId = dummyTrack.id
  const dummyPrompts = await Feedback.getFeedbackPromptsbyTrackId(dummyTrackId);

  dummyTrack.prompts = dummyPrompts.map(x => ({...x, trackId: dummyTrackId}));

  res.status(200).send(dummyTrack);
});

// In-memory handling for form data from incoming multipart/form-data request
var processFile = multer()

// POST resource for track upload.
router.post('/', processFile.single("audio"), async function(req, res, next) {
  try {
    const track = await UploadService.Upload(req.body.name, req.file, req.body.genre, req.body.isPrivate);
  } catch(e) {
    console.log("error", e)
    res.status(400).send(e);
  }
  
  // TODO: send back uploaded track info
  res.status(201).send(track);
});

router.post('/privacy/:slug', async function(req, res, next) {
  try {
    const track = Tracks.updateTrackPrivacy(req.params.slug, req.body.isPrivate);
  } catch(e) {
    console.log("error", e)
    res.status(400).send(e);
  }
})

module.exports = router;