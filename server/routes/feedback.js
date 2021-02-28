var express = require('express');
var Feedback = require('../db/models').Feedback;
var router = express.Router();

router.post('/', async function(req, res, next) {
  const { userEmail }  = req; 
  console.log(`Received feedback from user ${userEmail}`, req.body);
  feedbackRec = await Feedback.create(req.body.trackId, req.body.userId, req.body.value, req.body.promptId);
  console.log(feedbackRec);
  res.status(201).send(feedbackRec);
});

module.exports = router;