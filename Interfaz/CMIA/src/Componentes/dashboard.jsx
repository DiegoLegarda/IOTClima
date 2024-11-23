import React, { useEffect, useState } from 'react';
import Temperature from './sensorTemperatura';
import Humidity from './sensorHumedad';
import Iconos from './iconos';
import Historico from './historico';
import HistoricoGrap from './historicoGrap';
import Estadisticos from './Estadisticos.jsx';
import axios from 'axios';
import './dashboard.css'



function Dashboard() {
    const [temperature, setTemperature] = useState(0); 
    const [humidity, setHumidity] = useState(0);       
    const [showGraph, setShowGraph] = useState(true);  

    const toggleView = () => {
        setShowGraph(!showGraph); // Cambiar entre gráfica y tabla
    };

    const handleExportCSV = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/mariaDB/export-csv', {
                responseType: 'blob', 
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'readings.csv'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error al exportar CSV:', error);
        }
    };

    const handleResetData = async () => {
        try {
            await axios.delete('http://localhost:3002/api/mariaDB/reset-data');
            alert('Datos reiniciados con éxito');
        } catch (error) {
            console.error('Error al reiniciar los datos:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard de Monitoreo</h1>
            <div className="CajaGrande">
                <div className="CajaPeque">
                    <Temperature onTemperatureChange={setTemperature} />
                </div>
                
                <div className="CajaPeque">
                    <Humidity onHumidityChange={setHumidity} />
                </div>
            </div>
            <Iconos temperature={temperature} humidity={humidity} />
            <div><Estadisticos></Estadisticos></div>
            <div className="button-container">
                <button onClick={toggleView}>
                    {showGraph ? 'Ver Histórico' : 'Ver Gráfica'}
                </button>
            </div>
            <br></br>
            {showGraph ? <HistoricoGrap /> : <Historico />}
            <button onClick={handleExportCSV}>Exportar a CSV</button>
            <button onClick={handleResetData}>Reiniciar Datos</button>
        </div>
    );
};

export default Dashboard;
