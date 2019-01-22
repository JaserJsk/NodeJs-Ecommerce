const express = require('express');

const { body } = require('express-validator/check');

const managerController = require('../../controllers/admin/manager');

const isAuth = require('../../middleware/is_auth');

const router = express.Router();

/**
 * Routes for admin products.
 */
router.get('/products', isAuth.merhant, managerController.getProducts);

router.get('/add-product', isAuth.merhant, managerController.getAddProduct);

router.post('/add-product', [
    body('title').isString().isLength({ min: 5 }).withMessage('Title must be minimum of 5 characters.').trim(),
    body('price').isFloat().withMessage('Price must be a floating number.'),
    body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be minimum of 5 characters & maximum of of 1000.').trim()
], isAuth.merhant, managerController.postAddProduct);

/**
 * Routes for editing product.
 */
router.get('/edit-product=:productId', isAuth.merhant, managerController.getEditProduct);

router.post('/edit-product', [
    body('title').isString().isLength({ min: 5 }).withMessage('Title must be minimum of 5 characters.').trim(),
    body('price').isFloat().withMessage('Price must be a floating number.'),
    body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be minimum of 5 characters & maximum of of 1000.').trim()
], isAuth.merhant, managerController.postEditProduct);

/**
 * Route for deleting a product.
 */
router.delete('/product/:productId', isAuth.merhant, managerController.deleteProduct);

module.exports = router;