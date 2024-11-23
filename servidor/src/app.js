const express = require('express');
const cors = require('cors');
const axios = require("axios");
const rutasMongoDB = require('./rutas/rutasMDB');
const rutasMariaDB = require('./rutas/rutasMariaDB');
const rutasControlLeds = require('./rutas/rutasControlLeds');
const conectMDB=require('./basesdatos/mongodb');
const conectMariaDB=require('./basesdatos/mariadb');
const { iniciarMQTT } = require('./mqtt/clienteMqtt');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT||3000;
app.use(cors());

// Middleware para parsear el body de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Conectar a MongoDB si está habilitado
if (process.env.USE_MONGODB === 'true') {
    conectMDB();
  }
  
  // Conectar a MariaDB si está habilitado
  if (process.env.USE_MARIADB === 'true') {
    conectMariaDB();
  }
  
  // Iniciar el cliente MQTT si al menos una base de datos está habilitada
  if (process.env.USE_MONGODB === 'true' || process.env.USE_MARIADB === 'true') {
    iniciarMQTT();
    app.use('/api/control',rutasControlLeds);
  }

// Rutas
if (process.env.USE_MONGODB === 'true') {
    app.use('/api/mongoDB', rutasMongoDB); 
  }
  
  if (process.env.USE_MARIADB === 'true') {
    app.use('/api/mariaDB', rutasMariaDB);     
  }

//conexion con el servidor de python
app.get("/api/estadisticos", async (req, res) => {
  try {
      const response = await axios.get("http://localhost:5000/api/sensor_stats");
      res.json(response.data);
  } catch (error) {
      console.error("Error fetching data from Flask API:", error.message);
      res.status(500).json({ error: "Error fetching data from Python API" });
  }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

