const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const keys = require('../../../../Credentials/keys');
const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: keys.SENDGRID_API_KEY
    }
}));

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
                    return transporter.sendMail({
                        to: email,
                        from: 'support@senseidev.com',
                        subject: 'Signup Succeeded!',
                        html: '<h2>You have signed up successfully!</h2>'
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (request, response, next) => {
    request.session.destroy(err => {
        console.log(err);
        response.redirect('/');
    });
};

exports.getReset = (request, response, next) => {
    let message = request.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    response.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/auth/reset',
        errorMessage: message
    });
};

exports.postReset = (request, response, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return response.redirect('/auth/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: request.body.email })
            .then(user => {
                if (!user) {
                    request.flash('error', 'No account with that email found!');
                    response.redirect('/auth/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                response.redirect('/auth/login');
                transporter.sendMail({
                    to: request.body.email,
                    from: 'support@senseidev.com',
                    subject: 'Password Reset!',
                    html: `
                        <p>You have requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password</p>
                    `
                });
            })
            .catch(err => {
                console.log(err);
            });
    });
};