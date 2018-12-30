const Product = require('../../models/product')

// GET INDEX PAGE
exports.getIndex = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('index', {
            prods: products,
            pageTitle: 'Ecomerce',
            path: '/'
        });
    });
};

// GET PRODUCT PAGE
exports.getProducts = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('product_list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

// GET CART PAGE
exports.getCart = (request, response, next) => {
    response.render('cart', {
        path: '/cart',
        pageTitle: 'Your Cart'
    });
};

// GET ORDES PAGE
exports.getOrders = (request, response, next) => {
    response.render('orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

// GET CECKOUT PAGE
exports.getCheckout = (request, response, next) => {
    response.render('checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};