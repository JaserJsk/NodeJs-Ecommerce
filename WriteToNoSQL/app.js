const fs = require('fs');
const path = require('path');
/* const https = require('https'); */

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const isAuth = require('./middleware/is_auth');
const User = require('./models/user');

const MONGODB_URI_ECOMMERCE = 
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@githubcluster-jqh7o.gcp.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true`;

const ecommerceController = require('./controllers/site/ecommerce');
const errorsController = require('./controllers/errors');

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI_ECOMMERCE,
    collection: 'sessions'
});

const csrfProtection = csrf();

/* const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert'); */

const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'images');
    },
    filename: (request, file, callback) => {
        callback(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
  });

const fileFilter = (request, file, callback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {

        callback(null, true);
    } else {
        callback(null, false);
    }
};

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

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), 
    { flags: 'a'}
);

// Add special headers.
app.use(helmet());

// Compress assets.
app.use(compression());

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
    session({
        secret: 'auth secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(flash());

app.use((request, response, next) => {
    response.locals.isAuthenticated = request.session.isLoggedIn;
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

/**
 * Route post order.
 */
app.post('/place-order', isAuth.customer, ecommerceController.postOrder);

app.use(csrfProtection);
app.use((request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/admin', managerRoutes);
app.use(siteRoutes);
app.use(ecommerceRoutes);

app.get('/500', errorsController.get500);
app.use(errorsController.get404);

app.use((error, request, response, next) => {
    response.status(500).render('site/500', {
        pageTitle: 'Error!',
        path: '/500',
        /* isAuthenticated: request.session.isLoggedIn */
    });
});

mongoose.connect(MONGODB_URI_ECOMMERCE, { useNewUrlParser: true })
    .then(result => {
        
        // Used when we want to run local server with ssl mode.
        /* https.createServer({key: privateKey, cert: certificate}, app)
            .listen(process.env.PORT || 3000); */

        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err)
    });

mongoose.set('useCreateIndex', true);