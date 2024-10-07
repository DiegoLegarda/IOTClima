const readingsMariaDBService = require('../servicios/serviciosMariaDB');
const fs = require('fs');
const path = require('path');

/**
 * Obtener la última lectura de temperatura desde MariaDB.
 */
const getLatestTemperatureMariaDB = async (req, res) => {
  try {
    const temperature = await readingsMariaDBService.getLatestTemperatureMariaDB();
    if (temperature === null) {
      return res.status(404).json({ message: 'No se encontraron lecturas' });
    }
    res.json({ temperature });
  } catch (error) {
    console.error('Error al obtener la temperatura:', err);
    res.status(500).json({ message: 'Error al obtener la temperatura' });
  }
};

/**
 * Obtener la última lectura de humedad desde MariaDB.
 */
const getLatestHumidityMariaDB = async (req, res) => {
  try {
    const humidity = await readingsMariaDBService.getLatestHumidityMariaDB();
    if (humidity === null) {
      return res.status(404).json({ message: 'No se encontraron lecturas' });
    }
    res.json({ humidity });
  } catch (error) {
    console.error('Error al obtener la humedad:', err);
    res.status(500).json({ message: 'Error al obtener la humedad' });
  }
};

/**
 * Obtener todo el histórico de lecturas desde MariaDB.
 */
const getAllReadingsMariaDB = async (req, res) => {
  try {
    const readings = await readingsMariaDBService.getAllReadingsMariaDB();
    res.json(readings);
  } catch (error) {
    console.error('Error al obtener lecturas históricas:', err);
    res.status(500).json({ message: 'Error al obtener lecturas históricas' });
  }
};

/**
 * Reiniciar los datos en MariaDB.
 */
const resetDataMariaDB = async (req, res) => {
  try {
    await readingsMariaDBService.resetDataMariaDB();
    res.status(200).json({ message: 'Datos reiniciados con éxito' });
  } catch (error) {
    console.error('Error al reiniciar los datos:', err);
    res.status(500).json({ message: 'Error al reiniciar los datos' });
  }
};

/**
 * Exportar datos a CSV desde MariaDB.
 */
const exportReadingsToCSVMariaDB = async (req, res) => {
  try {
    const readings = await readingsMariaDBService.exportReadingsToCSVMariaDB();
    const csvFilePath = path.join(__dirname, '..', 'readings_mariadb.csv');

    // Crear el contenido CSV
    const header = 'ID,Temperature,Humidity,Timestamp\n';
    const rows = readings.map(row =>
      `${row.id},${row.temperature},${row.humidity},${new Date(row.timestamp).toISOString()}`
    ).join('\n');

    // Escribir el archivo CSV
    fs.writeFileSync(csvFilePath, header + rows);

    // Enviar el archivo CSV
    res.download(csvFilePath, 'readings_mariadb.csv', (err) => {
      if (err) {
        console.error('Error al descargar el archivo CSV:', err);
        console.error('Error al descargar el archivo CSV:', err);
      }
      // Opcional: Eliminar el archivo después de la descarga
      fs.unlinkSync(csvFilePath);
    });
  } catch (error) {
    console.error('Error al exportar CSV:', err);
    res.status(500).json({ message: 'Error al exportar CSV' });
  }
};

/**
 * Guardar una nueva lectura en MariaDB.
 */
const saveReadingMariaDBController = async (temperature, humidity) => {
  try {
    const insertId = await readingsMariaDBService.saveReadingMariaDB(temperature, humidity);
    console.log(`Lectura guardada en MariaDB con ID: ${insertId}`);
  } catch (error) {
    console.error('Error al guardar lectura en MariaDB:', error);
  }
};

module.exports = {
  getLatestTemperatureMariaDB,
  getLatestHumidityMariaDB,
  getAllReadingsMariaDB,
  resetDataMariaDB,
  exportReadingsToCSVMariaDB,
  saveReadingMariaDBController
};
