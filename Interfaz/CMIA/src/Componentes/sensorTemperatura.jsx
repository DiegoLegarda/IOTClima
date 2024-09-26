import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Temperatura({ onTemperatureChange }) {
    const [temperature, setTemperature] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTemperature = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/temperature');
            console.log('Datos de temperatura obtenidos:', response.data);
            setTemperature(response.data.temperature);
            setLoading(false);
            onTemperatureChange(response.data.temperature)
        } catch (err) {
            console.error('Error al cargar los datos de temperatura:', err);
            setError('Error al cargar los datos de temperatura');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemperature(); 
        const interval = setInterval(fetchTemperature, 10000); 

        return () => clearInterval(interval); 
    }, [onTemperatureChange]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Temperatura del Sensor</h2>
            <p>{temperature !== null ? `${temperature} °C` : 'No disponible'}</p>
        </div>
    );
};



export default Temperatura;