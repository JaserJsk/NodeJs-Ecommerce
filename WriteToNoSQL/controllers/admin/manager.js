const { validationResult } = require('express-validator/check');

const Product = require('../../models/product');

/**
 * *********************************************************** 
 * Display list of all existing product!
 */
exports.getProducts = (request, response, next) => {
    Product.find()
        //.populate('userId')
        .then(products => {
            //console.log(products);
            response.render('admin/manager/products', {
                prods: products,
                pageTitle: 'Manage Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err)
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
    const imageUrl = request.body.imageUrl;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).render('admin/manager/edit_product', {
            pageTitle: 'Add Product',
            path: '/admin/edit_product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description,
                imageUrl: imageUrl
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

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
            console.log(err)
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
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            console.log(err)
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
    const updatedImageUrl = request.body.imageUrl;

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
                imageUrl: updatedImageUrl,
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
            product.imageUrl = updatedImageUrl;
            return product.save()
            .then(result => {
                console.log('Updated Product');
                response.redirect('/admin/products');
            });
        })
        .catch(err => {
            console.log(err)
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
            console.log(err)
        });
};