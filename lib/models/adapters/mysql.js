const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'mud',
  password: 'mud',
  database: 'mud',
  multipleStatements: true,
});

module.exports = pool;
