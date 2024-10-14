const express = require('express');
const router = express.Router();
const ControlLeds = require('../controladores/controladoresLeds');

router.post('/', ControlLeds);

module.exports =router;