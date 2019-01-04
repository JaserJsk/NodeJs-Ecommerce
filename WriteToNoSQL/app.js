const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./helpers/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const ecommerceRoutes = require('./routes/ecommerce');
const notFoundRoutes = require('./routes/404');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
    User.findById('5c2ed6a5126cde2a900b6451')
    .then(user => {
        request.user = new User(user.username, user.email, user.cart, user._id);
        next();
    })
    .catch(err => {console.log(err)});
});

app.use('/admin', adminRoutes);
app.use(ecommerceRoutes);
app.use(notFoundRoutes);

mongoConnect(() => {
    app.listen(3000);
});