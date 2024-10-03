const { Pool } = require('pg');

const pool = new Pool({
  user: 'dlegarda',
  host: 'localhost',
  database: 'baseiot',
  password: 'diego',
  port: 5432, // puerto por defecto para PostgreSQL
});

pool.connect((err) => {
  if (err) {
    console.error('Error al conectarse a PostgreSQL', err);
  } else {
    console.log('Conexión exitosa a PostgreSQL');
  }
});

module.exports = pool;