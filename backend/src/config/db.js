const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_feedback_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL database '${process.env.DB_NAME || 'student_feedback_db'}'`);
    connection.release();
    return { connected: true, message: 'Connected to MySQL database' };
  } catch (error) {
    console.warn('[Database Notice] MySQL connection failed:', error.message);
    console.warn('[Database Notice] System is using in-memory store as fallback mode.');
    return { 
      connected: false, 
      fallbackMode: true,
      error: error.message,
      message: 'Running in demo mode with in-memory store. Update DB_PASSWORD in backend/.env to connect MySQL.'
    };
  }
}

module.exports = {
  pool,
  testConnection
};
