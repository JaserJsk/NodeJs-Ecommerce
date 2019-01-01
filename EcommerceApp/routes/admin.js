const path = require('path');

const express = require('express');

const adminProductsController = require('../controllers/admin/ad_products');

const router = express.Router();

// /admin/add-product => GET
router.get('/dashboard', adminProductsController.getDashboard);

// /admin/add-product => GET
router.get('/add-product', adminProductsController.getAddProduct);

// /admin/products => GET
router.get('/products', adminProductsController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminProductsController.postAddProduct);

/**
 * Routes for editing product
 */
router.get('/edit-product=:productId', adminProductsController.getEditProduct);

router.post('/edit-product', adminProductsController.postEditProduct);

module.exports = router;