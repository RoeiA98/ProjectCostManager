var express = require('express');
var router = express.Router();

/* GET users listing. */
// path: localhost:3000/users
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// path: localhost:3000/users/contact
router.get('/contact', function(req, res, next) {
  res.send('contact us');
});

module.exports = router;
