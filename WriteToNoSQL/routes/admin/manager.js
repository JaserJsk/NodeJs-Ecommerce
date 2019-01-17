const express = require('express');

const { body } = require('express-validator/check');

const managerController = require('../../controllers/admin/manager');

const isAuth = require('../../middleware/is_auth');

const router = express.Router();

/**
 * Routes for admin products.
 */
router.get('/products', isAuth, managerController.getProducts);

router.get('/add-product', isAuth, managerController.getAddProduct);

router.post('/add-product', [
    body('title').isString().isLength({ min: 5 }).withMessage('Title must be minimum of 5 characters.').trim(),
    body('price').isFloat().withMessage('Price must be a floating number.'),
    body('description').isLength({ min: 10, max: 300 }).withMessage('Description must be minimum of 5 characters & maximum of of 300.').trim(),
    body('imageUrl').isURL().withMessage('ImageUrl must contain a valid URL.')
], isAuth, managerController.postAddProduct);

/**
 * Routes for editing product.
 */
router.get('/edit-product=:productId', isAuth, managerController.getEditProduct);

router.post('/edit-product', [
    body('title').isString().isLength({ min: 5 }).withMessage('Title must be minimum of 5 characters.').trim(),
    body('price').isFloat().withMessage('Price must be a floating number.'),
    body('description').isLength({ min: 10, max: 500 }).withMessage('Description must be minimum of 5 characters & maximum of of 500.').trim(),
    body('imageUrl').isURL().withMessage('ImageUrl must contain a valid URL.')
], isAuth, managerController.postEditProduct);

/**
 * Route for deleting a product.
 */
router.post('/delete-product', isAuth, managerController.postDeleteProduct);

module.exports = router;