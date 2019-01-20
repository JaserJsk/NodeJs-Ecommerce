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

const errorsController = require('./controllers/errors');

const app = express();
const store = new MongoDBStore({
    uri: keys.MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');


/* Auth */
const authRoutes = require('./routes/auth');

/* Admin */
const adminRoutes = require('./routes/admin/webmaster');
const managerRoutes = require('./routes/admin/manager');

/* Site */
const siteRoutes = require('./routes/site/webpage');
const ecommerceRoutes = require('./routes/site/ecommerce');

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
    response.locals.isAuthenticated = request.session.isLoggedIn;
    response.locals.csrfToken = request.csrfToken();
    next();
});

app.use((request, response, next) => {
    if (!request.session.user) {
        return next();
    }
    User.findById(request.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            request.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/admin', managerRoutes);
app.use(siteRoutes);
app.use(ecommerceRoutes);

app.get('/500', errorsController.get500);
app.use(errorsController.get404);

app.use((error, request, response, next) => {
    response.redirect('/500');
})

mongoose.connect(keys.MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });