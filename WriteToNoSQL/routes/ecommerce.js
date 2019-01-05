const path = require('path');

const express = require('express');

const shopProductsController = require('../controllers/ecommerce/ec_products');

const adminData = require('./admin');

const router = express.Router();

/**
 * Site index page.
 */
router.get('/', shopProductsController.getIndex);

/**
 * Routes customer products.
 */
router.get('/products', shopProductsController.getProducts);
router.get('/products/:productId', shopProductsController.getProductById);

/**
 * Routes for customer cart.
 */
router.get('/cart', shopProductsController.getCart);
router.post('/cart', shopProductsController.postToCart); 
router.post('/cart-delete-item', shopProductsController.postCartDeleteProduct);

/**
 * Routes customer orders.
 */
router.get('/orders', shopProductsController.getOrders);
router.post('/place-order', shopProductsController.postOrder);

//router.get('/checkout', shopProductsController.getCheckout);

module.exports = router;