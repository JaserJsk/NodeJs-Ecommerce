const express = require('express');

const ecommerceController = require('../../controllers/site/ecommerce');

const isAuth = require('../../middleware/is_auth');

const router = express.Router();

/**
 * Routes customer products.
 */
router.get('/products', ecommerceController.getProducts);
router.get('/products/:productId', ecommerceController.getProductById);

/**
 * Routes for customer cart.
 */
router.get('/cart', isAuth.customer, ecommerceController.getCart);
router.post('/cart', isAuth.customer, ecommerceController.postToCart); 
router.post('/cart-delete-item', isAuth.customer, ecommerceController.postCartDeleteProduct);

/**
 * Route customer orders.
 */
router.get('/orders', isAuth.customer, ecommerceController.getOrders);

/**
 * Route customer checkout.
 */
router.get('/checkout', isAuth.customer, ecommerceController.getCheckout);

/**
 * Route customer invoice.
 */
router.get('/orders/:orderId', isAuth.customer, ecommerceController.getInvoice);

module.exports = router;