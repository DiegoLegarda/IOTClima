import React, { useEffect, useState } from 'react';
import Temperature from './sensorTemperatura';
import Humidity from './sensorHumedad';
import Iconos from './iconos';
import Historico from './historico';
import HistoricoGrap from './historicoGrap';
import axios from 'axios';



function Dashboard() {
    const [temperature, setTemperature] = useState(0); // Estado para la temperatura
    const [humidity, setHumidity] = useState(0);       // Estado para la humedad
    const [showGraph, setShowGraph] = useState(true);  // Estado para controlar la visibilidad de la gráfica

    const toggleView = () => {
        setShowGraph(!showGraph); // Cambiar entre gráfica y tabla
    };

    const handleExportCSV = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/export-csv', {
                responseType: 'blob', // Importante para manejar archivos
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
            await axios.delete('http://localhost:3000/api/reset-data');
            alert('Datos reiniciados con éxito');
        } catch (error) {
            console.error('Error al reiniciar los datos:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard de Monitoreo</h1>
            <div className="dashboard-cards">
                <div className="card">
                    <Temperature onTemperatureChange={setTemperature} />
                </div>
                <div className="card">
                    <Humidity onHumidityChange={setHumidity} />
                </div>
            </div>
            <Iconos temperature={temperature} humidity={humidity} />

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
