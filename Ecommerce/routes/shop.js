const path = require('path');

const express = require('express');

const shopProductsController = require('../controllers/shop/sh_products');

const adminData = require('./admin');

const router = express.Router();

router.get('/', shopProductsController.getProducts);

module.exports = router;