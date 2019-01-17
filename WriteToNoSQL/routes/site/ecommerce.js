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
router.get('/cart', isAuth, ecommerceController.getCart);
router.post('/cart', isAuth, ecommerceController.postToCart); 
router.post('/cart-delete-item', isAuth, ecommerceController.postCartDeleteProduct);

/**
 * Routes customer orders.
 */
router.get('/orders', isAuth, ecommerceController.getOrders);
router.post('/place-order', isAuth, ecommerceController.postOrder);

//router.get('/checkout', ecommerceController.getCheckout);

module.exports = router;