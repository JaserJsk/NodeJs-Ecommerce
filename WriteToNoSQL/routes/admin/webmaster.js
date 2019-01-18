const express = require('express');

const { body } = require('express-validator/check');

const webmasterController = require('../../controllers/admin/webmaster');

const isAuth = require('../../middleware/is_auth');

const router = express.Router();

/**
 * Admin Dashboard.
 */
router.get('/dashboard', isAuth, webmasterController.getDashboard);

router.get('/edit-merchant', isAuth, webmasterController.getEditMerchantProfile);
router.post('/edit-merchant', [
    body('firstName').isAlphanumeric().withMessage('Enter your first name.').trim(),
    body('lastName').isAlphanumeric().withMessage('Enter your last name.').trim(),
    body('phone').isString().withMessage('Enter your phone number.').trim(),
    body('address').isString().withMessage('Enter your current address.').trim(),
    body('biography').isLength({ min: 10, max: 500 }).withMessage('Biography must be minimum of 5 characters & maximum of of 500.').trim(),
    body('photoUrl').isURL().withMessage('PhotoUrl must contain a valid URL.')
], isAuth, webmasterController.postEditMerchantProfile);

module.exports = router;