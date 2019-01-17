const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const keys = require('../../../Credentials/keys');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
    uri: keys.MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const siteRoutes = require('./routes/site');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const ecommerceRoutes = require('./routes/ecommerce');
const errorRoutes = require('./routes/errors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'auth secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(csrfProtection);
app.use(flash());

app.use((request, response, next) => {
    if (!request.session.user) {
        return next();
    }
    User.findById(request.session.user._id)
        .then(user => {
            request.user = user;
            next();
        })
        .catch(err => {console.log(err)});
});

app.use((request, response, next) => {
    response.locals.isAuthenticated = request.session.isLoggedIn;
    response.locals.csrfToken = request.csrfToken();
    next();
});

app.use(siteRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use(ecommerceRoutes);
app.use(errorRoutes);

mongoose.connect(keys.MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });