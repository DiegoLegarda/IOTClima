const mqtt = require('mqtt');
const MongoDB = require('../controladores/controladoresMDB'); // Para MongoDB
const MariaDB = require('../controladores/controladoresMariaDB'); // Para MariaDB
require('dotenv').config();
const client = mqtt.connect(process.env.MQTT_BROKER_URL);


const iniciarMQTT = () => {
  client.on('connect', () => {
    console.log('Conectado al broker MQTT');
    // Suscribirse al tema de datos de DHT11
    client.subscribe(process.env.MQTT_TOPIC, (err) => {
      if (err) {
        console.error('Error al suscribirse al tema MQTT:', err);
      } else {
        console.log(`Suscrito al tema: ${process.env.MQTT_TOPIC}`);
      }
    });

    // Suscribirse al tema de control de LEDs
    const ledControlTopic = 'esp32/ledControl'; 
    client.subscribe(ledControlTopic, (err) => {
      if (err) {
        console.error('Error al suscribirse al tema de control de LEDs:', err);
      } else {
        console.log(`Suscrito al tema de control de LEDs: ${ledControlTopic}`);
      }
    });
  });

  client.on('message', async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`Mensaje recibido en el tema ${topic}:`, data);

      if (topic === 'esp32/dht11') {        
        const { temperature, humidity } = data;
        if (typeof temperature !== 'number' || typeof humidity !== 'number') {
          throw new Error('Datos de temperatura o humedad inválidos');
        }

        if (process.env.USE_MONGODB === 'true') {
          await MongoDB.SalvarDatos(temperature, humidity);
        }

        if (process.env.USE_MARIADB === 'true') {
          await MariaDB.saveReadingMariaDBController(temperature, humidity);
        }
      }
      
    } catch (error) {
      console.error('Error al procesar el mensaje MQTT:', error);
    }
  });

  client.on('error', (err) => {
    console.error('Error en el cliente MQTT:', err);
  });
};

// Función para enviar valores PWM a los LEDs
const enviarPWM = (pwmLed1, pwmLed2) => {  
  const controlTopic = 'esp32/ledControl';  

  // Crear el payload con los valores PWM
  const payload = {
    led1: pwmLed1,
    led2: pwmLed2
  };
  const message = JSON.stringify(payload);

  // Publicar el mensaje en el tópico MQTT
  client.publish(controlTopic, message, (err) => {
    if (err) {
      console.error('Error al publicar el mensaje:', err);
    } else {
      console.log(`Mensaje enviado al tópico ${controlTopic}:`, message);
    }
  });
};

module.exports = { iniciarMQTT, enviarPWM };
