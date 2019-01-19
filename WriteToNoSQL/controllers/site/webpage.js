const { validationResult } = require('express-validator/check');

const User = require('../../models/user');

/**
 * *********************************************************** 
 * Index page!
 */
exports.getIndex = (request, response, next) => {
    if (request.session.isLoggedIn) {
        User.findById(request.user._id)
            .then(user => {
                response.render('site/index', {
                    pageTitle: 'Ecomerce',
                    path: '/',
                    user: user,
                });
            })
            .catch(err => {
                console.log(err)
            });
    }
    else {
        response.render('site/index', {
            pageTitle: 'Ecomerce',
            path: '/',
        });
    }
};

/**
 * *********************************************************** 
 * About page!
 */
exports.getAbout = (request, response, next) => {
    if (request.session.isLoggedIn) {
        console.log('You are logged in');
        User.findById(request.user._id)
            .then(user => {
                response.render('site/about', {
                    pageTitle: 'About',
                    path: '/about',
                    user: user,
                });
            })
            .catch(err => {
                console.log(err)
            });
    }
    else {
        console.log('You are not logged in');
        response.render('site/about', {
            pageTitle: 'About',
            path: '/about',
        });
    }
};

/**
 * *********************************************************** 
 * Contact page!
 */
exports.getContact = (request, response, next) => {
    if (request.session.isLoggedIn) {
        console.log('You are logged in');
        User.findById(request.user._id)
            .then(user => {
                response.render('site/contact', {
                    pageTitle: 'Contact',
                    path: '/contact',
                    user: user,
                });
            })
            .catch(err => {
                console.log(err)
            });
    }
    else {
        console.log('You are not logged in');
        response.render('site/contact', {
            pageTitle: 'Contact',
            path: '/contact',
        });
    }
};

/**
 * ***********************************************************
 * Display customer profile page!
 */
exports.getEditCustomerProfile = (request, response, next) => {
    let message = request.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    const userId = request.user._id;
    User.findById(userId)
        .then(user => {
            response.render('site/edit_customer', {
                pageTitle: 'Edit Customer',
                path: '/edit_customer',
                user: user,
                errorMessage: message,
                validationErrors: []
            });
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postEditCustomerProfile = (request, response, next) => {
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const photoUrl = request.body.photoUrl;
    const UserId = request.user._id;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).render('site/edit_customer', {
            pageTitle: 'Edit Customer',
            path: '/edit_customer',
            user: {
                firstName: firstName,
                lastName: lastName,
                email: request.user.email,
                photoUrl: photoUrl
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    User.findOne(UserId)
        .then(user => {
            user.firstName = firstName ? firstName : user.firstName;
            user.lastName = lastName ? lastName : user.lastName;
            user.photoUrl = photoUrl ? photoUrl : user.photoUrl;
            return user.save();
        })
        .then(result => {
            console.log('Updated Customer Profile Info');
            response.redirect('/edit-customer');
        })
        .catch(err => {
            console.log(err)
        });
};