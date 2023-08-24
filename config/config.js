require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

db.connect(function(error) {
    if (error) throw error;
    console.log('DATABASE CONNECTED!');
});

module.exports = db;