const path = require('path');

const express = require('express');

const errorsController = require('../controllers/errors');

const router = express.Router();

router.use(errorsController.get404);

module.exports = router;