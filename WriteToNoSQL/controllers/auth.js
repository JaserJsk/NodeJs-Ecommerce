const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

const keys = require('../../../../Credentials/keys');

sgMail.setApiKey(keys.SENDGRID_API_KEY);

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
                        firstName: '',
                        lastName: '',
                        email: email,
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
    User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now()} })
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

    User.findOne({ resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()},
        _id: userId })
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