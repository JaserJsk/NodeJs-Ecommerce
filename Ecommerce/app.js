const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Used for ejs
//app.set('view engine', 'ejs');

// Used for pug
app.set('view engine', 'pug');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFoundRoutes = require('./routes/404');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(notFoundRoutes);

app.listen(3000);
