const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
    User.findById('5c3017fd51ea871c545fee6a')
    .then(user => {
        request.user = user;
        next();
      })
    .catch(err => {console.log(err)});
});

app.use('/admin', adminRoutes);
app.use(ecommerceRoutes);
app.use(notFoundRoutes);

mongoose.connect('mongodb+srv://jonas:IEOd3MRoKhcvx7I1@githubcluster-jqh7o.mongodb.net/ecommerce?retryWrites=true')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    firstName: 'Jonas',
                    lastName: 'Jsk',
                    email: 'jonas.jsk@outlook.com',
                    photoUrl: 'https://archive.senseidev.com/assets/001.jpg',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });