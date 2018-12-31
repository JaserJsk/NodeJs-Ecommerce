const Product = require('../../models/product')

// GET INDEX PAGE
exports.getIndex = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('ecommerce/index', {
            prods: products,
            pageTitle: 'Ecomerce',
            path: '/'
        });
    });
};

// GET PRODUCT PAGE
exports.getProducts = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('ecommerce/product_list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

// GET CART PAGE
exports.getCart = (request, response, next) => {
    response.render('ecommerce/cart', {
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

// GET ORDES PAGE
exports.getOrders = (request, response, next) => {
    response.render('ecommerce/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    });
};

// GET CECKOUT PAGE
exports.getCheckout = (request, response, next) => {
    response.render('ecommerce/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};