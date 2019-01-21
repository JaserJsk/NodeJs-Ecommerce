const { validationResult } = require('express-validator/check');

const fileHelper = require('../../helpers/file');

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
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
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
        User.findById(request.user._id)
            .then(user => {
                response.render('site/about', {
                    pageTitle: 'About',
                    path: '/about',
                    user: user,
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }
    else {
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
        User.findById(request.user._id)
            .then(user => {
                response.render('site/contact', {
                    pageTitle: 'Contact',
                    path: '/contact',
                    user: user,
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }
    else {
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditCustomerProfile = (request, response, next) => {
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const phone = request.body.phone;
    const address = request.body.address;
    const image = request.file;
    const UserId = request.user._id;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).render('site/edit_customer', {
            pageTitle: 'Edit Customer',
            path: '/edit_customer',
            user: {
                email: request.user.email,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                address: address,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    User.findOne(UserId)
        .then(user => {
            user.firstName = firstName ? firstName : user.firstName;
            user.lastName = lastName ? lastName : user.lastName;
            user.phone = phone ? phone : user.phone;
            user.address = address ? address : user.address;
            if (image) {

                if (user.photoUrl) {
                    fileHelper.deleteFile(user.photoUrl);
                }

                user.photoUrl = image.path;
            }
            return user.save();
        })
        .then(result => {
            console.log('Updated Customer Profile Info');
            response.redirect('/edit-customer');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};