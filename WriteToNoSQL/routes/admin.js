const express = require('express');

const { body } = require('express-validator/check');

const adminProductsController = require('../controllers/admin');

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

router.post('/add-product', [
    body('title').isString().isLength({ min: 5 }).withMessage('Title must be minimum of 5 characters.').trim(),
    body('price').isFloat().withMessage('Price must be a floating number.'),
    body('description').isLength({ min: 10, max: 300 }).withMessage('Description must be minimum of 5 characters & maximum of of 300.').trim(),
    body('imageUrl').isURL().withMessage('ImageUrl must contain a valid URL.')
], isAuth, adminProductsController.postAddProduct);

/**
 * Routes for editing product.
 */
router.get('/edit-product=:productId', isAuth, adminProductsController.getEditProduct);

router.post('/edit-product', [
    body('title').isString().isLength({ min: 5 }).withMessage('Title must be minimum of 5 characters.').trim(),
    body('price').isFloat().withMessage('Price must be a floating number.'),
    body('description').isLength({ min: 10, max: 500 }).withMessage('Description must be minimum of 5 characters & maximum of of 300.').trim(),
    body('imageUrl').isURL().withMessage('ImageUrl must contain a valid URL.')
], isAuth, adminProductsController.postEditProduct);

/**
 * Route for deleting a product.
 */
router.post('/delete-product', isAuth, adminProductsController.postDeleteProduct);

module.exports = router;