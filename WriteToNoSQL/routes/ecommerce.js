const path = require('path');

const express = require('express');

const shopProductsController = require('../controllers/ecommerce/ec_products');
const isAuth = require('../middleware/is_auth');

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
router.get('/cart', isAuth, shopProductsController.getCart);
router.post('/cart', isAuth, shopProductsController.postToCart); 
router.post('/cart-delete-item', isAuth, shopProductsController.postCartDeleteProduct);

/**
 * Routes customer orders.
 */
router.get('/orders', isAuth, shopProductsController.getOrders);
router.post('/place-order', isAuth, shopProductsController.postOrder);

//router.get('/checkout', shopProductsController.getCheckout);

module.exports = router;