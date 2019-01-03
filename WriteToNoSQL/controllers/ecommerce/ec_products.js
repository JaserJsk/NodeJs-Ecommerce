const Product = require('../../models/product');

/**
 * *********************************************************** 
 * Site index page!
 */
exports.getIndex = (request, response, next) => {
    Product.findAll()
        .then(
            products => {
                response.render('ecommerce/index', {
                    prods: products,
                    pageTitle: 'Ecomerce',
                    path: '/'
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
    Product.findAll()
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
    request.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    response.render('ecommerce/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products
                    });
                })
                .catch(err => {
                    console.log(err)
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
    let fetchedCart;
    let newQuantity = 1;
    request.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({
                where: {
                    id: prodId
                }
            })
        })
        .then(products => {
            let product
            if (products.length > 0) {
                product = products[0]
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findById(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            });
        })
        .then(() => {
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
    request.user.getCart()
        .then(cart => {
            return cart.getProducts({
                where: {
                    id: prodId
                }
            });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
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
    let fetchedCart;
    request.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return request.user
                .createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = {
                                quantity: product.cartItem.quantity
                            };
                            return product;
                        })
                    );
                })
                .catch(err => {
                    console.log(err)
                });
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
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
    request.user
        .getOrders({include: ['products']})
        .then(orders => {
            response.render('ecommerce/order', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
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