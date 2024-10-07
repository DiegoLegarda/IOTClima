const getMariaDBConnection  = require('../basesdatos/mariadb');
const ReadingMariaDB = require('../modelos/modeloMariaDB');

/**
 * Obtener la última lectura de temperatura.
 */
const getLatestTemperatureMariaDB = async () => {
  let conn;
  try {
    conn = await getMariaDBConnection();
    const rows = await conn.query('SELECT temperature FROM readings ORDER BY timestamp DESC LIMIT 1');
    if (rows.length === 0) return null;
    return rows[0].temperature;
  } catch (error) {
    console.error('Error al obtener la temperatura de MariaDB:', error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Obtener la última lectura de humedad.
 */
const getLatestHumidityMariaDB = async () => {
  let conn;
  try {
    conn = await getMariaDBConnection();
    const rows = await conn.query('SELECT humidity FROM readings ORDER BY timestamp DESC LIMIT 1');
    if (rows.length === 0) return null;
    return rows[0].humidity;
  } catch (error) {
    console.error('Error al obtener la humedad de MariaDB:', error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Obtener todo el histórico de lecturas.
 */
const getAllReadingsMariaDB = async () => {
  let conn;
  try {
    conn = await getMariaDBConnection();
    const rows = await conn.query('SELECT * FROM readings ORDER BY timestamp DESC');
    return rows.map(row => new ReadingMariaDB(row.id, row.temperature, row.humidity, row.timestamp));
  } catch (error) {
    console.error('Error al obtener lecturas históricas de MariaDB:', error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Reiniciar los datos en MariaDB.
 */
const resetDataMariaDB = async () => {
  let conn;
  try {
    conn = await getMariaDBConnection();
    await conn.query('DELETE FROM readings');
  } catch (error) {
    console.error('Error al reiniciar datos en MariaDB:', error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Exportar datos a CSV desde MariaDB.
 */
const exportReadingsToCSVMariaDB = async () => {
  let conn;
  try {
    conn = await getMariaDBConnection();
    const rows = await conn.query('SELECT * FROM readings ORDER BY timestamp DESC');
    return rows;
  } catch (error) {
    console.error('Error al exportar CSV desde MariaDB:', error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Guardar una nueva lectura en MariaDB.
 */
const saveReadingMariaDB = async (temperature, humidity) => {
    let conn;
    try {
      conn = await getMariaDBConnection();
      const res = await conn.query(
        'INSERT INTO readings (temperature, humidity) VALUES (?, ?)',
        [temperature, humidity]
      );
      return res.insertId;
    } catch (error) {
      console.error('Error al guardar lectura en MariaDB:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  };
module.exports = {
  getLatestTemperatureMariaDB,
  getLatestHumidityMariaDB,
  getAllReadingsMariaDB,
  resetDataMariaDB,
  exportReadingsToCSVMariaDB,
  saveReadingMariaDB
};
