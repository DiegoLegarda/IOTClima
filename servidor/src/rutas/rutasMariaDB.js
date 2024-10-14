const express = require('express');
const router = express.Router();
const MariaDB = require('../controladores/controladoresMariaDB');

router.get('/temperatura', MariaDB.getLatestTemperatureMariaDB);
router.get('/humedad', MariaDB.getLatestHumidityMariaDB);
router.get('/historico', MariaDB.getAllReadingsMariaDB);
router.delete('/reset-data', MariaDB.resetDataMariaDB);
router.get('/exportar-csv', MariaDB.exportReadingsToCSVMariaDB);

module.exports = router;
