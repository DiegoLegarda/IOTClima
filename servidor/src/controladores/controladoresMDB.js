const { 
    LeerTemperatura,
    LeerHumedad,
    LeerHIstorico,
    ExportarCSV,
    Reiniciar,
    SalvarLectura 
} = require('../servicios/serviciosMDB');

async function lecturarTemperatura(req, res) {
    try {
        const latestReading = await LeerTemperatura();
        if (!latestReading) {
            return res.status(404).json({ message: 'No se encontraron lecturas' });
        }
        res.json({ temperature: latestReading.temperature });
    } catch (err) {
        console.error('Error al obtener la temperatura:', err);
        res.status(500).json({ message: 'Error al obtener la temperatura' });
    }
}

async function lecturaHumedad(req, res) {
    try {
        const latestReading = await LeerHumedad();
        if (!latestReading) {
            return res.status(404).json({ message: 'No se encontraron lecturas' });
        }
        res.json({ humidity: latestReading.humidity });
    } catch (err) {
        console.error('Error al obtener la humedad:', err);
        res.status(500).json({ message: 'Error al obtener la humedad' });
    }
}

async function historicoLecturas(req, res) {
    try {
        const readings = await LeerHIstorico();
        res.json(readings);
    } catch (err) {
        console.error('Error al obtener lecturas históricas:', err);
        res.status(500).json({ message: 'Error al obtener lecturas históricas' });
    }
}

async function exportarCSV(req, res) {
    try {
        const csvFilePath = await ExportarCSV(); // Llamamos al servicio para exportar datos
        res.download(csvFilePath, 'readings.csv', (err) => {
            if (err) {
                console.error('Error al descargar el archivo CSV:', err);
            }
        });
    } catch (err) {
        console.error('Error al exportar CSV:', err);
        res.status(500).json({ message: 'Error al exportar CSV' });
    }
}

async function resetearDatos(req, res) {
    try {
        await Reiniciar();
        res.status(200).json({ message: 'Datos reiniciados con éxito' });
    } catch (err) {
        console.error('Error al reiniciar los datos:', err);
        res.status(500).json({ message: 'Error al reiniciar los datos' });
    }
}

/**
 * Guardar una nueva lectura en MongoDB.
 */
const SalvarDatos = async (temperature, humidity) => {
    try {
      await SalvarLectura(temperature, humidity);
      console.log('Lectura guardada en MongoDB');
    } catch (error) {
      console.error('Error al guardar lectura en MongoDB:', error);
    }
  };

module.exports = {
    lecturarTemperatura,
    lecturaHumedad,
    historicoLecturas,
    exportarCSV,
    resetearDatos,
    SalvarDatos
};