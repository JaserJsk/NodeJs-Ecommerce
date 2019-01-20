exports.get404 = (request, response, next) => {
    response.status(404).render('site/404', { 
        pageTitle: 'Page Not Found',
        path: '/404',
        isAuthenticated: request.session.isLoggedIn
    });
};

exports.get500 = (request, response, next) => {
    response.status(500).render('site/500', { 
        pageTitle: 'Internal server error',
        path: '/500',
        isAuthenticated: request.session.isLoggedIn
    });
};