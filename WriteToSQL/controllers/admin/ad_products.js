const Product = require('../../models/product');

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
    request.user.createProduct({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
    })
    .then(result => {
        console.log('Created Product')
        response.redirect('/admin/products');
    })
    .catch(err => {console.log(err)});
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
    //Product.findById(prodId) - Old Way
    request.user.getProducts({where: {id: prodId}}) // New Way
        .then(products => {
            const product = products[0];
            if (!product) {
                return response.redirect('/admin/products');
            }
            response.render('admin/edit_product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit_product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => {console.log(err)});
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

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;            
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
            console.log('Updated Product');
            response.redirect('/admin/products');
        })
        .catch(err => {console.log(err)});
};

/**
 * *********************************************************** 
 * Display list of all existing product!
 */
exports.getProducts = (request, response, next) => {
    //Product.findAll() - Old Way
    request.user // New Way
        .getProducts()
        .then(products => {
            response.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {console.log(err)});
};

/**
 * *********************************************************** 
 * Delete an existing product!
 */
exports.postDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId;
    Product.findById(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Destroyed Product');
            response.redirect('/admin/products');
        })
        .catch(err => {console.log(err)});
};