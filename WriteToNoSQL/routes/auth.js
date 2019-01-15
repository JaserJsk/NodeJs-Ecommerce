const express = require('express');

const { body } = require('express-validator/check');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

/**
 * Authentication Register/Login.
 */
router.get('/login', authController.getLogin);

router.post('/login', [
    body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
    body('password', 'Password has to be a minimum of 6 characters.').isLength({ min: 6 }).isAlphanumeric().trim()
], authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', [
    body('email').isEmail().withMessage('Enter a valid email.').custom(( value, { req }) => {
        return User.findOne({ email: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email already exists, please pick another!');
            }
        });
    }).normalizeEmail(),
    body('password', 'Enter a password with 6 characters with numbers & text only.').isLength({ min: 6}).isAlphanumeric().trim(),
    body('confirmPassword').custom(( value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    }).trim(),
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);


module.exports = router;