var express = require('express');
var multer = require('multer')

var UploadService = require('../services/upload');

var router = express.Router();

// TODO: move this to prompt controller once added.
const numericPromptType = "numeric";

// GET resource for track data.
router.get('/:slug', function(req, res, next) {
  // TODO: retrieve track from DB.
  const dummyTrack = {
    id: 1,
    slug: req.params.slug,
    title: 'My Amazing Track',
    artist: 'Singer Santa',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    genre: 'RnB',
  }

  // TODO: lookup feedback prompts in DB for this track.
  const dummyPrompts = [
    {
      id: dummyTrack.id,
      trackId: 1,
      type: numericPromptType,
      text: "How would you rate this track?",
      scale: 10,
    },
    {
      id: 2,
      trackId: dummyTrack.id,
      type: numericPromptType,
      text: "How likely are you to listen to this track again?",
      scale: 10,
    },
  ]
  dummyTrack.prompts = dummyPrompts;

  res.status(200).send(dummyTrack);
});

// In-memory handling for form data from incoming multipart/form-data request
var processFile = multer()

// POST resource for track upload.
router.post('/', processFile.single("audio"), async function(req, res, next) {
  try {
    await UploadService.Upload(req.body.name, req.file);
  } catch(e) {
    console.log("error", e)
    res.status(400).send(e);
  }
  
  // TODO: send back uploaded track info
  res.status(201).send();
});

module.exports = router;