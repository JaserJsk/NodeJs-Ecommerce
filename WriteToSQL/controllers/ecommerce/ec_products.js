const Product = require('../../models/product')
const Cart = require('../../models/cart')

/**
 * *********************************************************** 
 * Site index page!
 */
exports.getIndex = (request, response, next) => {
    Product.fetchAll().then(
        ([rows]) => {
            response.render('ecommerce/index', {
                prods: rows,
                pageTitle: 'Ecomerce',
                path: '/'
            });
        }
    ).catch(
        err => console.log(err)
    );
};

/**
 * *********************************************************** 
 * Display products to customers!
 */
exports.getProducts = (request, response, next) => {
    Product.fetchAll()
    .then(([rows]) => {
        response.render('ecommerce/product_list', {
            prods: rows,
            pageTitle: 'All Products',
            path: '/products'
        });
    })
    .catch(err => console.log(err));
};

/**
 * *********************************************************** 
 * Display product detail to customers!
 */
exports.getProductById = (request, response, next) => {
    const prodId = request.params.productId;
    Product.findById(prodId).then(
        ([product]) => {
            response.render('ecommerce/product_detail', {
                product: product[0],
                pageTitle: product.title,
                path: '/products'
            });
        }
    ).catch(
        err => console.log(err)
    );
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