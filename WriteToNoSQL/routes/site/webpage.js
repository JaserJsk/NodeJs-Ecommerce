const express = require('express');

const { body } = require('express-validator/check');

const siteController = require('../../controllers/site/webpage');

const isAuth = require('../../middleware/is_auth');

const router = express.Router();

/**
 * Site index page.
 */
router.get('/', siteController.getIndex);

/**
 * Site about page.
 */
router.get('/about', siteController.getAbout);

/**
 * Routes for Editing profile.
 */
router.get('/edit-customer', isAuth.customer, siteController.getEditCustomerProfile);
router.post('/edit-customer', [
    body('firstName').isAlphanumeric().withMessage('Enter your first name.').trim(),
    body('lastName').isAlphanumeric().withMessage('Enter your last name.').trim(),
    body('phone').isString().withMessage('Enter your phone number.').trim(),
    body('address').isString().withMessage('Enter your current address.').trim()
], isAuth.customer, siteController.postEditCustomerProfile);

/**
 * Site contact page.
 */
router.get('/contact', siteController.getContact);

module.exports = router;