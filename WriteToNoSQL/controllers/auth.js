const bcrypt = require('bcryptjs');
const User = require('../models/user');

/**
 * *********************************************************** 
 * Authentication section!
 */
exports.getLogin = (request, response, next) => {
    let message = request.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    response.render('auth/login', {
        pageTitle: 'Login',
        path: '/auth/login',
        errorMessage: message
    });
};

exports.getSignup = (request, response, next) => {
    let message = request.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    response.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/auth/signup',
        errorMessage: message
    });
};

exports.postLogin = (request, response, next) => {
    const email = request.body.email;
    const password = request.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                request.flash('error', 'Invalid email or password!');
                return response.redirect('/auth/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        request.session.isLoggedIn = true;
                        request.session.user = user;
                        return request.session.save(err => {
                                console.log(err);
                                console.log('User Found');
                                response.redirect('/');
                            });
                    }
                    request.flash('error', 'Invalid email or password!');
                    response.redirect('/auth/login');
                })
                .catch(err => {
                    console.log(err)
                    response.redirect('/auth/login');
                });
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postSignup = (request, response, next) => {
    const email = request.body.email;
    const password = request.body.password;
    const fonfirmPassword = request.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                request.flash('error', 'Email already exists, please pick another!')
                return response.redirect('/auth/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    })
                    return user.save();
                })
                .then(result => {
                    response.redirect('/auth/login');
                });
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postLogout = (request, response, next) => {
    request.session.destroy(err => {
        console.log(err);
        response.redirect('/');
    });
};