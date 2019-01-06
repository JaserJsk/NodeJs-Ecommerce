const path = require('path');

const express = require('express');

const adminProductsController = require('../controllers/admin/ad_products');
const isAuth = require('../middleware/is_auth');

const router = express.Router();

/**
 * Admin Dashboard.
 */
router.get('/dashboard', isAuth, adminProductsController.getDashboard);

/**
 * Routes for admin products.
 */
router.get('/products', isAuth, adminProductsController.getProducts);
router.get('/add-product', isAuth, adminProductsController.getAddProduct);
router.post('/add-product', isAuth, adminProductsController.postAddProduct);

/**
 * Routes for editing product.
 */
router.get('/edit-product=:productId', isAuth, adminProductsController.getEditProduct);
router.post('/edit-product', isAuth, adminProductsController.postEditProduct);

/**
 * Route for deleting a product.
 */
router.post('/delete-product', isAuth, adminProductsController.postDeleteProduct);

module.exports = router;