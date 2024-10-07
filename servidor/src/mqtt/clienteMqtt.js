const mqtt = require('mqtt');
const MongoDB = require('../controladores/controladoresMDB'); // Para MongoDB
const MariaDB = require('../controladores/controladoresMariaDB'); // Para MariaDB
require('dotenv').config();

const iniciarMQTT = () => {
    const client = mqtt.connect(process.env.MQTT_BROKER_URL);
  
    client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      client.subscribe(process.env.MQTT_TOPIC, (err) => {
        if (err) {
          console.error('Error al suscribirse al tema MQTT:', err);
        } else {
          console.log(`Suscrito al tema: ${process.env.MQTT_TOPIC}`);
        }
      });
    });
  
    client.on('message', async (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`Mensaje recibido en el tema ${topic}:`, data);
  
        const { temperature, humidity } = data;
  
        // Validar que los campos existan y sean del tipo correcto
        if (typeof temperature !== 'number' || typeof humidity !== 'number') {
          throw new Error('Datos de temperatura o humedad inválidos');
        }
  
        // Guardar en MongoDB si está habilitado
        if (process.env.USE_MONGODB === 'true') {
          await MongoDB.SalvarDatos(temperature, humidity);
        }
  
        // Guardar en MariaDB si está habilitado
        if (process.env.USE_MARIADB === 'true') {
          await MariaDB.saveReadingMariaDBController(temperature, humidity);
        }
  
      } catch (error) {
        console.error('Error al procesar el mensaje MQTT:', error);
      }
    });
  
    client.on('error', (err) => {
      console.error('Error en el cliente MQTT:', err);
    });
  };
  
  module.exports = { iniciarMQTT };

