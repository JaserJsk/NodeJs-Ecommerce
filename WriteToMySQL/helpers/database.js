const Sequelize = require('sequelize');

var database = 'node_ecommerce';
var user = 'root';
var password = 'JeyM2H7Q#';

const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql', host: 'localhost'
});

module.exports = sequelize;