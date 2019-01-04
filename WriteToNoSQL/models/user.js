const mongoDB = require('mongodb');
const getDatabase = require('../helpers/database').getDatabase;

const ObjectId = mongoDB.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const database = getDatabase();
        return database.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            });
        }
        const updatedCart = {
            items: updatedCartItems
        };
        const database = getDatabase();
        return database
            .collection('users')
            .updateOne({
                _id: new ObjectId(this._id)
            }, {
                $set: {
                    cart: updatedCart
                }
            });
    }

    getCart() {
        const database = getDatabase();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return database
            .collection('products')
            .find({
                _id: {
                    $in: productIds
                }
            })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                });
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const database = getDatabase();
        return database
            .collection('users')
            .updateOne({
                _id: new ObjectId(this._id)
            }, {
                $set: {
                    cart: {
                        items: updatedCartItems
                    }
                }
            });
    }

    static findById(userId) {
        const database = getDatabase();
        return database
            .collection('users')
            .findOne({
                _id: new ObjectId(userId)
            })
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;