const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const User = require('../../models/user');
const Product = require('../../models/product');
const Order = require('../../models/order');

/**
 * *********************************************************** 
 * Display products to customers!
 */
exports.getProducts = (request, response, next) => {
    if (request.session.isLoggedIn) {
        User.findById(request.user._id)
            .then(user => {
                Product.find()
                    .then(products => {
                        response.render('site/ecommerce/product_list', {
                            pageTitle: 'All Products',
                            path: '/products',
                            prods: products,
                            user: user
                        });
                    })
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }
    else {
        Product.find()
            .then(products => {
                response.render('site/ecommerce/product_list', {
                    pageTitle: 'All Products',
                    path: '/products',
                    prods: products,
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }

};

/**
 * *********************************************************** 
 * Display product detail to customers!
 */
exports.getProductById = (request, response, next) => {
    const prodId = request.params.productId;
    if (request.session.isLoggedIn) {
        User.findById(request.user._id)
            .then(user => {
                Product.findById(prodId)
                    .then(product => {
                        response.render('site/ecommerce/product_detail', {
                            product: product,
                            pageTitle: product.title,
                            path: '/products',
                            user: user
                        });
                    })
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }
    else {
        Product.findById(prodId)
            .then(product => {
                response.render('site/ecommerce/product_detail', {
                    product: product,
                    pageTitle: product.title,
                    path: '/products',
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }

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
            response.render('site/ecommerce/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                user: user
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            //console.log(result);
            response.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
                return { quantity: i.quantity, product: { ...i.productId._doc } }
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

/**
 * *********************************************************** 
 * Display customer ordered items!
 */
exports.getOrders = (request, response, next) => {
    Order.find({ "user.userId": request.user._id })
        .then(orders => {
            response.render('site/ecommerce/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
                user: request.user._id
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

/**
 * *********************************************************** 
 * Let customer download an invoice!
 */

exports.getInvoice = (request, response, next) => {
    const orderId = request.params.orderId;

    Order.findById(orderId)
    .then(order => {
        if (!order) {
            return next(new Error('No order was found.'));
        }
        if (order.user.userId.toString() !== request.user._id.toString()) {
            return next(new Error('You are Unauthorized.'));
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);

        const pdfDoc = new PDFDocument();
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(response);

        pdfDoc.fontSize(20).text('Order Invoice', {
            underline: true
        });

        pdfDoc.text('------------------------------------');
        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice = totalPrice + prod.quantity * prod.product.price;
            pdfDoc.fontSize(14).text(
                prod.product.title + ' --- ' + 
                prod.quantity + ' * ' + '$' + 
                prod.product.price
            );
        });

        pdfDoc.fontSize(16).text('Total Price: $' + totalPrice, {
            align: 'right'
        });

        pdfDoc.end();

    })
    .catch(err => {
        next(err);
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