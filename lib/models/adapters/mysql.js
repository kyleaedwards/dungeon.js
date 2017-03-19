const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'mud',
  password: process.env.DB_PASSWORD || 'mud',
  database: process.env.DB_DATABASE || 'mud',
  multipleStatements: true,
});

module.exports = pool;
