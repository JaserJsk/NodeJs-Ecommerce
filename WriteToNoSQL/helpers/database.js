const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let _database;

const mongoConnect = (callback) => {
    mongoClient.connect('mongodb+srv://jonas:IOfzpjVLGQqozb6S@nodejsecommerce-0ztl0.mongodb.net/ecommerce?retryWrites=true')
        .then(client => {
            console.log('Connected');
            _database = client.db();
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDatabase = () => {
    if (_database) {
        return _database;
    }
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDatabase = getDatabase;