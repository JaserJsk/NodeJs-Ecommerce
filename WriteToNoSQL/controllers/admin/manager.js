const { validationResult } = require('express-validator/check');

const Product = require('../../models/product');

/**
 * *********************************************************** 
 * Display list of all existing product!
 */
exports.getProducts = (request, response, next) => {
    Product.find()
        .then(products => {
            response.render('admin/manager/products', {
                pageTitle: 'Manage Products',
                path: '/admin/products',
                prods: products,
                user: request.user
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
 * Fetch single existing product!
 */
exports.getAddProduct = (request, response, next) => {
    response.render('admin/manager/edit_product', {
        pageTitle: 'Add Product',
        path: '/admin/add_product',
        user: request.user,
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

/**
 * *********************************************************** 
 * Add a new product!
 */
exports.postAddProduct = (request, response, next) => {
    const title = request.body.title;
    const price = request.body.price;
    const description = request.body.description;
    const image = request.file;

    if (!image) {
        return response.status(422).render('admin/manager/edit_product', {
            pageTitle: 'Add Product',
            path: '/admin/edit_product',
            editing: false,
            hasError: true,
            user: request.user, // I added this becouse I wanted to send data to the frontend.
            product: {
                title: title,
                price: price,
                description: description,
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []
        });
    }
    
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return response.status(422).render('admin/manager/edit_product', {
            pageTitle: 'Add Product',
            path: '/admin/edit_product',
            editing: false,
            hasError: true,
            user: request.user, // I added this becouse I wanted to send data to the frontend.
            product: {
                title: title,
                price: price,
                description: description,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl,
        userId: request.user
    });
    product.save()
        .then(result => {
            console.log('Created Product');
            response.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

/**
 * *********************************************************** 
 * Edit data of existing product!
 */
exports.getEditProduct = (request, response, next) => {
    const editMode = request.query.edit;
    if (!editMode) {
        return response.redirect('/admin/products');
    }
    const prodId = request.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return response.redirect('/admin/products');
            }
            response.render('admin/manager/edit_product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit_product',
                user: request.user,
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
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
 * Update data of existing product!
 */
exports.postEditProduct = (request, response, next) => {
    const prodId = request.body.productId;
    const updatedTitle = request.body.title;
    const updatedPrice = request.body.price;
    const updatedDesc = request.body.description;
    const image = request.file;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).render('admin/manager/edit_product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit_product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== request.user._id.toString()) {
                return response.redirect('/admin/products');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            if (image) {
                product.imageUrl = image.path;
            }
            return product.save()
            .then(result => {
                console.log('Updated Product');
                response.redirect('/admin/products');
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
 * Delete an existing product!
 */
exports.postDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId;
    Product.deleteOne({ _id: prodId, userId: request.user._id })
        .then(() => {
            console.log('Destroyed Product');
            response.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};