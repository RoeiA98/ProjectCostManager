var express = require('express');
var router = express.Router();

/* GET users listing. */
// path: localhost:3000/services
router.get('/', function(req, res, next) {
    res.send('services');
});

module.exports = router;