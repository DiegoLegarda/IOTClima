import React from 'react';
import { WiThermometer, WiHumidity } from 'react-icons/wi'; // Íconos de react-icons
import './iconos.css'; // Archivo CSS para animación
import ReactAnimatedWeather from 'react-animated-weather';

const Iconos = ({ temperature, humidity }) => {
    let tempIcon = 'CLEAR_DAY';
    let humidityIcon = 'PARTLY_CLOUDY_DAY';
    
    // Cambiar el ícono en función de la temperatura
    if (temperature > 30) {
      tempIcon = 'CLEAR_DAY'; // Sol brillante para calor
    } else if (temperature <= 30 && temperature >= 10) {
      tempIcon = 'HOT'; // Ícono de calor moderado
    } else {
      tempIcon = 'SNOW'; // Ícono de nieve para temperaturas bajas
    }
    
    // Cambiar el ícono en función de la humedad
    if (humidity > 70) {
      humidityIcon = 'RAIN'; // Lluvia para alta humedad
    } else if (humidity <= 70 && humidity >= 30) {
      humidityIcon = 'PARTLY_CLOUDY_DAY'; // Nublado parcial para humedad media
    } else {
      humidityIcon = 'FOG'; // Niebla para baja humedad
    }
    
    return (
      <div className="weather-icons">
        <h3>Clima Actual</h3>
        <div>
          <h4>Temperatura</h4>
          <ReactAnimatedWeather
            icon={tempIcon}
            color="goldenrod"
            size={150}
            animate={true}
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
