//const path = require('path');

const express = require('express');

//const rootDir = require('../helpers/path');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (request, response, next) => {
    const products = adminData.products;
    response.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        activeShop: true,
        productCSS: true
    });
});

module.exports = router;