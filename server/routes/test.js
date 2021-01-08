var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
    res.send(`API is working properly 😬. Logged in: ${req.userEmail || 'none'}`);
});

module.exports = router;