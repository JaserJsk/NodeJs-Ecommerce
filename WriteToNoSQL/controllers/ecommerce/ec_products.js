const Product = require('../../models/product');
const Order = require('../../models/order');

/**
 * *********************************************************** 
 * Site index page!
 */
exports.getIndex = (request, response, next) => {
    Product.find()
        .then(products => {
                response.render('ecommerce/index', {
                    prods: products,
                    pageTitle: 'Ecomerce',
                    path: '/',
                    isAuthenticated: request.session.isLoggedIn,
                    //csrfToken: request.csrfToken()
                });
            })
        .catch(err => {
            console.log(err)
        });
};

/**
 * *********************************************************** 
 * Display products to customers!
 */
exports.getProducts = (request, response, next) => {
    Product.find()
        .then(products => {
            response.render('ecommerce/product_list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                isAuthenticated: request.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err)
        });
};

/**
 * *********************************************************** 
 * Display product detail to customers!
 */
exports.getProductById = (request, response, next) => {
    const prodId = request.params.productId;
    Product.findById(prodId)
        .then(product => {
            response.render('ecommerce/product_detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
                isAuthenticated: request.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err)
        });
};

/**
 * *********************************************************** 
 * Display customer cart items!
 */
exports.getCart = (request, response, next) => {
    request.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            response.render('ecommerce/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                isAuthenticated: request.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err)
        });
};

/**
 * *********************************************************** 
 * Add item to customer cart!
 */
exports.postToCart = (request, response, next) => {
    const prodId = request.body.productId;
    Product.findById(prodId)
        .then(product => {
            return request.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            response.redirect('/cart');
        })
        .catch(err => {
            console.log(err)
        });
};

/**
 * *********************************************************** 
 * Delete an item from customer cart!
 */
exports.postCartDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId;
    request.user
        .removeFromCart(prodId)
        .then(result => {
            response.redirect('/cart');
        })
        .catch(err => {
            console.log(err)
        });
};

/**
 * *********************************************************** 
 * Move customer ordered items to checkout!
 */
exports.postOrder = (request, response, next) => {
    request.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: { ...i.productId._doc } }
            });
            const order = new Order({
                user: {
                    name: request.user.email,
                    userId: request.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return request.user.clearCart();
        })
        .then(() => {
            response.redirect('/orders');
        })
        .catch(err => {
            console.log(err)
        });
};

/**
 * *********************************************************** 
 * Display customer ordered items!
 */
exports.getOrders = (request, response, next) => {
    Order.find({ "user.userId": request.user._id })
        .then(orders => {
            response.render('ecommerce/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
                isAuthenticated: request.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err)
        });
};

// GET CECKOUT PAGE
/*
exports.getCheckout = (request, response, next) => {
    response.render('ecommerce/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};
*/