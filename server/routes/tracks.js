var express = require('express');
var router = express.Router();

router.get('/:slug', function(req, res, next) {
  // TODO: retrieve from DB.
  res.status(200).send({
    slug: req.params.slug,
    title: 'My Amazing Track',
    artist: 'Singer Santa',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    genre: 'RnB',
  });
});

module.exports = router;