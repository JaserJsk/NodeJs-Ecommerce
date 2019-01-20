const { validationResult } = require('express-validator/check');

const User = require('../../models/user');

/**
 * *********************************************************** 
 * Admin dashboard section!
 */
exports.getDashboard = (request, response, next) => {
    const userId = request.user._id;
    User.findById(userId)
        .then(user => {
            response.render('admin/dashboard', {
                pageTitle: 'Dashboard',
                path: '/admin/dashboard',
                user: user,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

/**
 * ***********************************************************
 * Display admin profile page!
 */
exports.getEditMerchantProfile = (request, response, next) => {
    let message = request.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    const userId = request.user._id;
    User.findById(userId)
        .then(user => {
            response.render('admin/edit_merchant', {
                pageTitle: 'Edit Merchant',
                path: '/edit_merchant',
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

exports.postEditMerchantProfile = (request, response, next) => {
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const phone = request.body.phone;
    const address = request.body.address;
    const biography = request.body.biography;
    const photoUrl = request.body.photoUrl;
    const UserId = request.user._id;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).render('admin/edit_merchant', {
            pageTitle: 'Edit Merchant',
            path: '/edit_merchant',
            user: {
                email: request.user.email,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                address: address,
                biography: biography,
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
            user.phone = phone ? phone : user.phone;
            user.address = address ? address : user.address;
            user.biography = biography ? biography : user.biography;
            user.photoUrl = photoUrl ? photoUrl : user.photoUrl;
            return user.save();
        })
        .then(result => {
            console.log('Updated Merchant Profile Info');
            response.redirect('/admin/edit-merchant');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};