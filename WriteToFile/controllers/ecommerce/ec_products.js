const Product = require('../../models/product')
const Cart = require('../../models/cart')

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

exports.getProductById = (request, response, next) => {
    const prodId = request.params.productId;
    Product.findById(prodId, product => {
        response.render('ecommerce/product_detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });
}

// GET CART PAGE
exports.getCart = (request, response, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(
                    prod => prod.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.qty
                    });
                }
            }
            response.render('ecommerce/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};

exports.postToCart = (request, response, next) => {
    const prodId = request.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    response.redirect('/cart');
};

exports.postCartDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        response.redirect('/cart');
    });
};

// GET CECKOUT PAGE
exports.getCheckout = (request, response, next) => {
    response.render('ecommerce/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};