const Reading = require('../modelos/modeloMDB');

/**
 * Obtener la última lectura de temperatura.
 */
const LeerTemperatura = async () => {
  try {
    const latestReading = await Reading.findOne().sort({ timestamp: -1 });
    return latestReading;
  } catch (error) {
    throw new Error('Error al obtener la temperatura');
  }
};

/**
 * Obtener la última lectura de humedad.
 */
const LeerHumedad= async () => {
  try {
    const latestReading = await Reading.findOne().sort({ timestamp: -1 });
    return latestReading;
  } catch (error) {
    throw new Error('Error al obtener la humedad');
  }
};

/**
 * Obtener todo el histórico de lecturas.
 */
const LeerHIstorico = async () => {
  try {
    const readings = await Reading.find().sort({ timestamp: -1 });
    return readings;
  } catch (error) {
    throw new Error('Error al obtener lecturas históricas');
  }
};

/**
 * Exportar datos a CSV.
 */
const ExportarCSV = async () => {
  try {
    const readings = await Reading.find({});
    const header = 'Temperature,Humidity,Timestamp\n';
    const rows = readings
      .map(
        (reading) =>
          `${reading.temperature},${reading.humidity},${reading.timestamp.toISOString()}`
      )
      .join('\n');
    const csvContent = header + rows;
    return csvContent;
  } catch (error) {
    throw new Error('Error al exportar CSV');
  }
};

//Ruta para reiniciar los datos en la base de datos
const Reiniciar= async () => {
    try {
        await Reading.deleteMany({});
        return "Datos reiniciados";
    } catch (err) {        
        return  'Error al reiniciar los datos';
    }
}

const SalvarLectura= async (temperature, humidity) => {
  try {
    const newReading = new Reading({
      temperature,
      humidity
    });
    await newReading.save();
  } catch (error) {
    console.error('Error al guardar lectura en MongoDB:', error);
    throw error;
  }
};

module.exports = {
    LeerTemperatura,
    LeerHumedad,
    LeerHIstorico,
    ExportarCSV,
    Reiniciar,
    SalvarLectura    
};
