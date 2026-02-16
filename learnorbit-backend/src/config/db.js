const mysql = require('mysql2/promise');
require('dotenv').config();

// Determine SSL options for cloud databases (like Render)
// If running in production or explicitly requested via DB_SSL env var
const ssl =
  process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false } // For self-signed certs often used in managed DBs
    : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: ssl, // Include SSL configuration
});

module.exports = pool;
