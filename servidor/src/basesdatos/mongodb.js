const mongoose = require('mongoose');
require('dotenv').config();

function connectMongoDB() {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
      console.log('Conectado a MongoDB');
  })
  .catch(err => {
      console.error('Error de conexión a MongoDB:', err);
  });
}

module.exports = connectMongoDB;