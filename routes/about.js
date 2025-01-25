var express = require('express');
var router = express.Router();

/* GET users listing. */
// path: localhost:3000/about
router.get('/', function(req, res, next) {
    res.send('about');
});

module.exports = router;