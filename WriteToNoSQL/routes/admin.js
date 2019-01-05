const path = require('path');

const express = require('express');

const adminProductsController = require('../controllers/admin/ad_products');

const router = express.Router();

/**
 * Admin Dashboard.
 */
router.get('/dashboard', adminProductsController.getDashboard);

/**
 * Routes for admin products.
 */
router.get('/products', adminProductsController.getProducts);
router.get('/add-product', adminProductsController.getAddProduct);
router.post('/add-product', adminProductsController.postAddProduct);

/**
 * Routes for editing product.
 */
router.get('/edit-product=:productId', adminProductsController.getEditProduct);
router.post('/edit-product', adminProductsController.postEditProduct);

/**
 * Route for deleting a product.
 */
router.post('/delete-product', adminProductsController.postDeleteProduct);

module.exports = router;