const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

const { validationResult } = require('express-validator/check');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const keys = require('../../../../Credentials/keys');
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
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
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
        errorMessage: message,
        oldInput: { 
            email: '', 
            password: '', 
            confirmPassword: '' 
        },
        validationErrors: []
    });
};

exports.postLogin = (request, response, next) => {
    const email = request.body.email;
    const password = request.body.password;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return response.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/auth/login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return response.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/auth/login',
                    errorMessage: 'Invalid email or password!',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: []
                });
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        request.session.isLoggedIn = true;
                        request.session.user = user;
                        return request.session.save(err => {
                            console.log(err);
                            response.redirect('/');
                        });
                    }
                    return response.status(422).render('auth/login', {
                        pageTitle: 'Login',
                        path: '/auth/login',
                        errorMessage: 'Invalid email or password!',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    });
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

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return response.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/auth/signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { 
                email: email, 
                password: password, 
                confirmPassword: request.body.confirmPassword 
            },
            validationErrors: errors.array()
        });
    }

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                firstName: '',
                lastName: '',
                phone: '',
                biography: '',
                address: '',
                photoUrl: '',
                password: hashedPassword,
                cart: { items: [] }
            })
            return user.save();
        })
        .then(result => {
            response.redirect('/auth/login');
            const signup = {
                to: email,
                from: 'support@senseidev.com',
                subject: 'Signup succeeded successfully!',
                html: '<h2>You successfully signed up!</h2>',
                templateId: keys.SIGNUP_TEMPLATE_ID,
                dynamic_template_data: {
                    subject: 'Signup succeeded successfully!',
                },
            };
            sgMail.send(signup);
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
                const reset = {
                    to: request.body.email,
                    from: 'support@senseidev.com',
                    subject: 'Reset your password!',
                    html: `
                        <p>You have requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/auth/reset/${token}">Link</a> to set a new password</p>
                    `,
                    templateId: keys.RESET_TEMPLATE_ID,
                    dynamic_template_data: {
                        subject: 'Reset your password!',
                        reset: `
                            <p>You have requested a password reset</p>
                            <p>Click this <a href="http://localhost:3000/auth/reset/${token}">Link</a> to set a new password</p>
                        `
                    },
                };
                sgMail.send(reset);
            })
            .catch(err => {
                console.log(err);
            });
    });
};

exports.getNewPassword = (request, response, next) => {
    const token = request.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = request.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            response.render('auth/new_password', {
                pageTitle: 'New Password',
                path: '/auth/new_password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postNewPassword = (request, response, next) => {
    const newPassword = request.body.password;
    const userId = request.body.userId;
    const passwordToken = request.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            response.redirect('/auth/login');
        })
        .catch(err => {
            console.log(err);
        });
};