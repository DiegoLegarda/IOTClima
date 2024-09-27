import React, { useEffect, useState } from 'react';

const Historico = () => {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReadings = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/readings');
                if (!response.ok) {
                    throw new Error('Error al obtener lecturas');
                }
                const data = await response.json();
                setReadings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReadings();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Histórico de Lecturas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Fecha y Hora</th>
                        <th>Temperatura (°C)</th>
                        <th>Humedad (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {readings.map((reading) => (
                        <tr key={reading._id}>
                            <td>{new Date(reading.timestamp).toLocaleString()}</td>
                            <td>{reading.temperature}</td>
                            <td>{reading.humidity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Historico;