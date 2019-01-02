const mySQL = require('mysql2');

const pool = mySQL.createPool({
    host: 'localhost',
    database: 'node_ecommerce',
    user: 'root',
    password: 'JeyM2H7Q#'
});

module.exports = pool.promise();