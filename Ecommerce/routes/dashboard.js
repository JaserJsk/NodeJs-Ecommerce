const express = require('express');

const router = express.Router();

router.get('/dashboard', (request, response, next) => {
    
    response.render('dashboard', {
        pageTitle: 'dashboard',
        path: '/',
        activeShop: true,
        productCSS: true
    });

});

module.exports = router;