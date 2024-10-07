const express = require('express');
const router = express.Router();
const {
    lecturarTemperatura,
    lecturaHumedad,
    historicoLecturas,
    resetearDatos,
    exportarCSV 
} = require('../controladores/controladoresMDB');


router.get('/temperatura', lecturarTemperatura);
router.get('/humedad', lecturaHumedad);
router.get('/historico', historicoLecturas);
router.delete('/reset-data', resetearDatos);
router.get('/exportar-csv', exportarCSV);

module.exports = router;