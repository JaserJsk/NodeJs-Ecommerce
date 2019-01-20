module.exports = {
    
    merhant: (request, response, next) => {

        if (!request.session.isLoggedIn) {
            return response.redirect('/auth/login');
        }

        if (request.user.isMerchant === "on") {
            next();
        }

    },

    customer: (request, response, next) => {
        if (!request.session.isLoggedIn) {
            return response.redirect('/auth/login');
        }

        if (request.user.isMerchant === "off") {
            next();
        }
        
    }
}