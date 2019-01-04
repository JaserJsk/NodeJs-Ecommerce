const mongoDB = require('mongodb');
const getDatabase = require('../helpers/database').getDatabase;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongoDB.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const database = getDatabase();
        let dbOparation 
        if (this._id) {
            // Update product
            dbOparation = database.collection('products')
                .updateOne({ _id: this._id }, { $set: this });
        }
        else {
            dbOparation = database
                .collection('products')
                .insertOne(this);
        }
        return dbOparation.then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const database = getDatabase();
        return database.collection('products')
        .find()
        .toArray()
        .then(products => {
            console.log(products);
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findById(prodId) {
        const database = getDatabase();
        return database
            .collection('products')
            .find({ _id: new mongoDB.ObjectId(prodId) })
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteById(prodId) {
        const database = getDatabase();
        return database.collection('products').deleteOne({ _id: new mongoDB.ObjectId(prodId) })
            .then(result => {
                console.log('Deleted');
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Product;