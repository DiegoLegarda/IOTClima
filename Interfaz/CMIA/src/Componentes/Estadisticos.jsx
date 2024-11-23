import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Estadisticos.css";

const Estadisticos = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    axios
      .get("http://localhost:3002/api/estadisticos")
      .then((response) => {
        console.log("Datos recibidos:", response.data);
        setStats(response.data);
        
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los datos");
      });
  }, []);

  // Muestra un mensaje mientras los datos se cargan
  if (!stats && !error) {
    return <div>Cargando datos...</div>;
  }

  // Muestra un mensaje de error si la API falla
  if (error) {
    return <div>{error}</div>;
  }
  if(stats){
    console.log('valor promedio temperatura',stats.temperature.average);
  }
  return (
    <div className="container">
    <h2>Estadísticas del Sensor</h2>
    <div className="stat-card">
      <h3>Temperatura</h3>
      <p>Promedio: {stats.temperature.average} °C</p>
      <p>Máximo: {stats.temperature.max} °C</p>
      <p>Mínimo: {stats.temperature.min} °C</p>
      <p>Desviación estándar: {stats.temperature.std_dev} °C</p>
    </div>
    <div className="stat-card">
      <h3>Humedad</h3>
      <p>Promedio: {stats.humidity.average} %</p>
      <p>Máximo: {stats.humidity.max} %</p>
      <p>Mínimo: {stats.humidity.min} %</p>
      <p>Desviación estándar: {stats.humidity.std_dev} %</p>
    </div>
  </div>
);
  
};




export default Estadisticos;