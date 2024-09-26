const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mqtt = require('mqtt'); 

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

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

