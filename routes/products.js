const express = require('express');
const router = express.Router();
/* GET specific product listing */
router.get('/:product_id', function(request,response) {
    response.status(200);
    response.set('Content-Type', 'text/html');
    response.end('<html><body>' +
        '<h1>product id ' + request.params.product_id + '</h1>' + // extracting product id
        '</body></html>'
    );
});
/* GET products listing. */
router.get('/', function(req, res, next) {
    res.send('this is the products page');
});

module.exports = router;