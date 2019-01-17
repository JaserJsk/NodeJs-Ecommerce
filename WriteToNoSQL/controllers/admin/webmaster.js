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
            console.log(err)
        });
};