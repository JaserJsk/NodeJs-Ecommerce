//const path = require('path');

const express = require('express');

//const rootDir = require('../helpers/path');

const router = express.Router();

router.use((request, response, next) => {
    response.status(404).render('404', { pageTitle: 'Page Not Found'});
});

module.exports = router;