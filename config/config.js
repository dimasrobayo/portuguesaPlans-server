const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'portuguesaPlan'
});

db.connect(function(error) {
    if (error) throw error;
    console.log('DATABASE CONNECTED!');
});

module.exports = db;