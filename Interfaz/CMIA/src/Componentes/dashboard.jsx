import React, { useEffect, useState } from 'react';
import Temperature from './sensorTemperatura';
import Humidity from './sensorHumedad';
import Iconos from './iconos';

function Dashboard(){
    const [temperature, setTemperature] = useState(0); // Estado para la temperatura
  const [humidity, setHumidity] = useState(0);       // Estado para la humedad


    return (
        <div className="dashboard-container">
            <h1>Dashboard de Monitoreo</h1>
            <div className="dashboard-cards">
                <div className="card">
                    <Temperature onTemperatureChange={setTemperature} />
                </div>
                <div className="card">
                    <Humidity onHumidityChange={setHumidity}/>
                </div>
            </div>
            <Iconos temperature={temperature} humidity={humidity}/>
        </div>
    );
};

export default Dashboard;
