exports.get404 = (request, response, next) => {
    response.status(404).render('site/404', { pageTitle: 'Page Not Found' });
};