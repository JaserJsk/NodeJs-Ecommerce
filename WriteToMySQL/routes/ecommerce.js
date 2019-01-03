const path = require('path');

const express = require('express');

const shopProductsController = require('../controllers/ecommerce/ec_products');

const adminData = require('./admin');

const router = express.Router();

router.get('/', shopProductsController.getIndex);

router.get('/products', shopProductsController.getProducts);

router.get('/products/:productId', shopProductsController.getProductById);

router.get('/cart', shopProductsController.getCart);

router.post('/cart', shopProductsController.postToCart);

router.post('/cart-delete-item', shopProductsController.postCartDeleteProduct);

router.get('/orders', shopProductsController.getOrders);

router.post('/place-order', shopProductsController.postOrder);

//router.get('/checkout', shopProductsController.getCheckout);

module.exports = router;