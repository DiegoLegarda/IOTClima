const Broker = require('../mqtt/clienteMqtt');

const DatosControl = (req, res) => {
    const { datos1, datos2 } = req.body;

    try {
        // Validar que se han proporcionado datos
        if (!datos1 || !datos2) {
            return res.status(400).send({ error: 'Faltan datos' }); // Responder con estado 400 si faltan datos
        } else {
            Broker.enviarPWM(parseInt(datos1), parseInt(datos2)); // Enviar los datos al broker MQTT
            return res.status(200).send({ mensaje: 'Datos enviados correctamente' }); // Responder con éxito
        }
    } catch (error) {
        console.error('Error procesando la solicitud:', error);
        return res.status(500).send({ error: 'Error interno del servidor' }); // Responder con error 500 en caso de excepción
    }
};

module.exports = DatosControl;
