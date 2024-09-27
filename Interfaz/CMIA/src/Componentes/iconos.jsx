import React from 'react';
import { WiThermometer, WiHumidity } from 'react-icons/wi'; // Íconos de react-icons
import './iconos.css'; // Archivo CSS para animación
import ReactAnimatedWeather from 'react-animated-weather';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerFull } from '@fortawesome/free-solid-svg-icons';



const Iconos = ({ temperature, humidity }) => {
  let tempIcon = 'CLEAR_DAY';
  let humidityIcon = 'PARTLY_CLOUDY_DAY';

  // Cambiar el ícono en función de la temperatura
  if (temperature > 30) {
    tempIcon = 'faThermometerFull'; // Termómetro para temperaturas altas
  } else if (temperature <= 30 && temperature >= 10) {
    tempIcon = 'faThermometerHalf'; // Termómetro moderado
  } else {
    tempIcon = 'faThermometerEmpty'; // Termómetro para bajas temperaturas
  }

  // Cambiar el ícono en función de la humedad
  if (humidity > 70) {
    humidityIcon = 'RAIN';
  } else if (humidity <= 70 && humidity >= 30) {
    humidityIcon = 'PARTLY_CLOUDY_DAY';
  } else {
    humidityIcon = 'FOG';
  }

  return (
    <div className="weather-icons">
      <h3>Clima Actual</h3>
      <div>
        <h4>Temperatura</h4>
        <FontAwesomeIcon
          icon={faThermometerFull} // Ícono de termómetro
          size="10x" // Ajusta el tamaño aquí
          color={temperature > 30 ? 'red' : 'blue'} // Color dependiendo de la temperatura
        />
      </div>
      <div>
        <h4>Humedad</h4>
        <ReactAnimatedWeather
          icon={humidityIcon}
          color="dodgerblue"
          size={150}
          animate={true}
        />
      </div>
    </div>
  );
};

export default Iconos;