import mysql.connector
import statistics
from flask import Flask, jsonify

# Configuración de la conexión a MariaDB
db_config = {
    "host": "localhost",
    "user": "root",  # Cambia según tu configuración
    "password": "dlegarda",
    "database": "BaseIOT",
}


# Función para obtener y calcular los datos
def fetch_sensor_data():
    try:
        # Conexión a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Consulta para obtener los datos de la tabla "readings"
        cursor.execute("SELECT temperature, humidity FROM readings")
        rows = cursor.fetchall()

        # Separar los valores de temperature y humidity
        temperatures = [row[0] for row in rows]
        humidities = [row[1] for row in rows]

        stats = {
            "temperature": {
                "average": round(sum(temperatures) / len(temperatures), 2) if temperatures else 0,
                "max": round(max(temperatures), 2) if temperatures else 0,
                "min": round(min(temperatures), 2) if temperatures else 0,
                "std_dev": round(statistics.stdev(temperatures), 2) if len(temperatures) > 1 else 0,
            },
            "humidity": {
                "average": round(sum(humidities) / len(humidities), 2) if humidities else 0,
                "max": round(max(humidities), 2) if humidities else 0,
                "min": round(min(humidities), 2) if humidities else 0,
                "std_dev": round(statistics.stdev(humidities), 2) if len(humidities) > 1 else 0,
            },
        }

        cursor.close()
        conn.close()
        return stats

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

# Crear servidor Flask
app = Flask(__name__)

@app.route("/api/sensor_stats", methods=["GET"])
def sensor_stats():
    stats = fetch_sensor_data()
    if stats:
        return jsonify(stats)
    else:
        return jsonify({"error": "No se pudieron obtener los datos"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
