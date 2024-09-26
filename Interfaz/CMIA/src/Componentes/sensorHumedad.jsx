import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Humedad({ onHumidityChange }){
    const [humidity, setHumidity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHumidity = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/humidity');
            console.log('Datos de humedad obtenidos:', response.data);
            setHumidity(response.data.humidity);
            setLoading(false);
            onHumidityChange(response.data.humidity);
        } catch (err) {
            console.error('Error al cargar los datos de humedad:', err);
            setError('Error al cargar los datos de humedad');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHumidity(); 
        const interval = setInterval(fetchHumidity, 10000); 

        return () => clearInterval(interval); 
    }, [onHumidityChange]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Humedad del Sensor</h2>
            <p>{humidity !== null ? `${humidity} %` : 'No disponible'}</p>
        </div>
    );
};

export default Humedad;