
const mysql = require('mysql2');
const { db_host, db_user, db_pass, db_name, db_port } = require("../config");

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: db_host,
  port: db_port,
  user: db_user,
  password: db_pass,
  database: db_name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = {
  pool,
};
