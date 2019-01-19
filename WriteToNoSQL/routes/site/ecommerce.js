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
 * Routes customer orders.
 */
router.get('/orders', isAuth.customer, ecommerceController.getOrders);
router.post('/place-order', isAuth.customer, ecommerceController.postOrder);

//router.get('/checkout', ecommerceController.getCheckout);

module.exports = router;