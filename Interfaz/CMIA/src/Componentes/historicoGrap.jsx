import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chartjs-adapter-date-fns';
import { Chart, registerables } from 'chart.js';

// Registrar todos los elementos de Chart.js, incluyendo las escalas
Chart.register(...registerables);

const HistoricoGrap = () => {
    const [data, setData] = useState({ temperature: [], humidity: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3002/api/mariaDB/historico');
                const readings = response.data;

                const temperatureData = readings.map(reading => ({
                    x: new Date(reading.timestamp),
                    y: reading.temperature,
                }));
                const humidityData = readings.map(reading => ({
                    x: new Date(reading.timestamp),
                    y: reading.humidity,
                }));

                setData({
                    temperature: temperatureData,
                    humidity: humidityData,
                });
            } catch (error) {
                console.error('Error al obtener los datos históricos:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Actualizar cada 10 segundos

        return () => clearInterval(interval);
    }, []);

    const temperatureChartData = {
        datasets: [
            {
                label: 'Temperatura',
                data: data.temperature,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    const humidityChartData = {
        datasets: [
            {
                label: 'Humedad',
                data: data.humidity,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour', // Muestra la hora
                    tooltipFormat: 'MMM d, h:mm a', // Formato para el tooltip (cambia D a d)
                    displayFormats: {
                        hour: 'MMM d, h:mm a', // Formato de visualización (cambia D a d)
                    },
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Gráfica de Temperatura</h2>
            <Line data={temperatureChartData} options={options} />
            <h2>Gráfica de Humedad</h2>
            <Line data={humidityChartData} options={options} />
        </div>
    );
};

export default HistoricoGrap;
