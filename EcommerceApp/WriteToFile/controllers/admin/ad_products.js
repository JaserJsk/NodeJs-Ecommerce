const Product = require('../../models/product')

/**
 * *********************************************************** 
 * Admin dashboard section!
 */
exports.getDashboard = (request, response, next) => {
    response.render('admin/dashboard', {
        pageTitle: 'Dashboard',
        path: '/admin/dashboard'
    });
};

/**
 * *********************************************************** 
 * Fetch single existing product!
 */
exports.getAddProduct = (request, response, next) => {
    response.render('admin/edit_product', {
        pageTitle: 'Add Product',
        path: '/admin/add_product',
        editing: false
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
    const product = new Product(null, title, price, description, imageUrl);
    product.save();
    response.redirect('/admin/products');
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
    Product.findById(prodId, product => {
        if (!product) {
            return response.redirect('/admin/products');
        }
        response.render('admin/edit_product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit_product',
            editing: editMode,
            product: product
        });
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
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedPrice,
        updatedDesc,
        updatedImageUrl,
    );
    updatedProduct.save();
    response.redirect('/admin/products');
};

/**
 * *********************************************************** 
 * Display list of all existing product!
 */
exports.getProducts = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};

/**
 * *********************************************************** 
 * Delete an existing product!
 */
exports.postDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId;
    Product.deleteById(prodId);
    response.redirect('/admin/products');
};