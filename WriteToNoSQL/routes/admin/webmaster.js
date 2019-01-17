const express = require('express');

const { body } = require('express-validator/check');

const adminController = require('../../controllers/admin/webmaster');

const isAuth = require('../../middleware/is_auth');

const router = express.Router();

/**
 * Admin Dashboard.
 */
router.get('/dashboard', isAuth, adminController.getDashboard);

module.exports = router;