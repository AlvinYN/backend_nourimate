const mysql = require('mysql2');
require('dotenv').config();

const dbpool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'nourimate123',
    database: process.env.DB_NAME || 'nourimate_ta',
    port: process.env.DB_PORT || 3307,
});

module.exports = dbpool.promise();
