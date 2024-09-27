const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mqtt = require('mqtt'); 
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
app.use(cors());

mongoose.connect('mongodb://localhost:27017/sensorData')
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(err => {
        console.error('Error de conexión a MongoDB:', err);
    });

// Definir un esquema y un modelo
const readingSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now }
});
const Reading = mongoose.model('Reading', readingSchema);

// Configurar el cliente MQTT
const client = mqtt.connect('mqtt://localhost:1883'); 

client.on('connect', () => {
    console.log('Conectado a MQTT');
    client.subscribe('esp32/dht11', (err) => {
        if (!err) {
            console.log('Suscrito a los temas de temperatura y humedad');
        } else {
            console.error('Error al suscribirse:', err);
        }
    });
});


client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString()); 
    console.log(topic);
    console.log(data);    
    const newReading = new Reading({
        temperature: data.temperature,
        humidity: data.humidity
    });

    newReading.save()
        .then(() => {
            console.log('Datos guardados:', newReading);
        })
        .catch(err => {
            console.error('Error al guardar en la base de datos:', err);
        });
});


// Ruta para obtener la última lectura de temperatura
app.get('/api/temperature', async (req, res) => {
    try {
        const latestReading = await Reading.findOne().sort({ timestamp: -1 }); // Obtener la última lectura
        if (!latestReading) {
            return res.status(404).json({ message: 'No se encontraron lecturas' });
        }
        res.json({ temperature: latestReading.temperature });
    } catch (err) {
        console.error('Error al obtener la temperatura:', err);
        res.status(500).json({ message: 'Error al obtener la temperatura' });
    }
});

// Ruta para obtener la última lectura de humedad
app.get('/api/humidity', async (req, res) => {
    try {
        const latestReading = await Reading.findOne().sort({ timestamp: -1 }); // Obtener la última lectura
        if (!latestReading) {
            return res.status(404).json({ message: 'No se encontraron lecturas' });
        }
        res.json({ humidity: latestReading.humidity });
    } catch (err) {
        console.error('Error al obtener la humedad:', err);
        res.status(500).json({ message: 'Error al obtener la humedad' });
    }
});

// Ruta para obtener todo el histórico de lecturas
app.get('/api/readings', async (req, res) => {
    try {
        const readings = await Reading.find().sort({ timestamp: -1 }); // Obtener todas las lecturas, ordenadas por timestamp
        res.json(readings);
    } catch (err) {
        console.error('Error al obtener lecturas históricas:', err);
        res.status(500).json({ message: 'Error al obtener lecturas históricas' });
    }
});

// Ruta para exportar datos a CSV
app.get('/api/export-csv', async (req, res) => {
    try {
        const readings = await Reading.find({});
        const csvFilePath = path.join(__dirname, 'readings.csv');
        
        // Crear el contenido CSV
        const header = 'Temperature,Humidity,Timestamp\n';
        const rows = readings.map(reading => 
            `${reading.temperature},${reading.humidity},${reading.timestamp.toISOString()}`
        ).join('\n');

        // Escribir el archivo CSV
        fs.writeFileSync(csvFilePath, header + rows);

        // Enviar el archivo CSV
        res.download(csvFilePath, 'readings.csv', (err) => {
            if (err) {
                console.error('Error al descargar el archivo CSV:', err);
            }
        });
    } catch (err) {
        console.error('Error al exportar CSV:', err);
        res.status(500).json({ message: 'Error al exportar CSV' });
    }
});

// Ruta para reiniciar los datos en la base de datos
app.delete('/api/reset-data', async (req, res) => {
    try {
        await Reading.deleteMany({});
        res.status(200).json({ message: 'Datos reiniciados con éxito' });
    } catch (err) {
        console.error('Error al reiniciar los datos:', err);
        res.status(500).json({ message: 'Error al reiniciar los datos' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

