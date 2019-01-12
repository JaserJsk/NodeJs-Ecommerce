const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

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
                path: '/products'
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
                path: '/products'
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
                products: products
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
                    email: request.user.email,
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
                orders: orders
            });
        })
        .catch(err => {
            console.log(err)
        });
};

/**
 * ***********************************************************
 * ***********************************************************
 * ***********************************************************
 * ***********************************************************
 * ***********************************************************
 * ***********************************************************
 * ***********************************************************
 * ***********************************************************
 * ***********************************************************
 * ***********************************************************
 * Display customer profile page!
 */
exports.getAddProfile = (request, response, next) => {
    response.render('ecommerce/edit_profile', {
        pageTitle: 'Add Profile',
        path: '/add_profile',
        editing: false
    });
};

exports.postAddProfile = (request, response, next) => {
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const photoUrl = request.body.photoUrl;

    User.findOne({ userId: request.user.userId })
        .then(user => {
            user.firstName = firstName;
            user.lastName = lastName;
            user.photoUrl = photoUrl;
            return user.save();
        })
        .then(result => {
            console.log('Added Profile Info');
            response.redirect('/');
        })
        .catch(err => {
            console.log(err)
        });
};

exports.getEditProfile = (request, response, next) => {
    const editMode = request.query.edit;
    if (!editMode) {
        return response.redirect('/');
    }
    const userId = request.params.userId;
    User.findById(userId)
        .then(user => {
            if (!user) {
                return response.redirect('/');
            }
            response.render('/edit_profile', {
                pageTitle: 'Edit Profile',
                path: '/edit_profile',
                editing: editMode,
                user: user
            });
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postEditProfile = (request, response, next) => {
    const userId = request.body.userId;
    const updatedFirstName = request.body.firstName;
    const updatedLastName = request.body.lastName;
    const updatedPhotoUrl = request.body.photoUrl;

    User.findById(userId)
        .then(user => {
            user.firstName = updatedFirstName;
            user.lastName = updatedLastName;
            user.photoUrl = updatedPhotoUrl;
            return user.save();
        })
        .then(result => {
            console.log('Updated User');
            response.redirect('/');
        })
        .catch(err => {
            console.log(err)
        });
}


// GET CECKOUT PAGE
/*
exports.getCheckout = (request, response, next) => {
    response.render('ecommerce/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};
*/