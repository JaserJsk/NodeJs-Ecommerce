
/**
 * *********************************************************** 
 * Admin dashboard section!
 */
exports.getDashboard = (request, response, next) => {
    response.render('admin/dashboard', {
        pageTitle: 'Dashboard',
        path: '/admin/dashboard'
    });
};