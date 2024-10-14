const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  port: process.env.MARIADB_PORT || 3306,
  connectionLimit: 5
});

const conectMariaDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`Conexiones activas: ${pool.activeConnections()}, Conexiones inactivas: ${pool.idleConnections()}`);
    console.log('Conectado a MariaDB');
    return connection;
  } catch (error) {
    console.error('Error de conexión a MariaDB:', error);
    throw error;
  }
};

module.exports=conectMariaDB;
