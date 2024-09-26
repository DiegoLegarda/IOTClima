#include <DHT.h>

// Definición de pines y tipo de sensor
#define DHTPIN 23  // Pin donde está conectado el DHT11
#define DHTTYPE DHT11  // Definir el tipo de sensor DHT

// Inicializar el objeto DHT
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // Inicializar comunicación serial a 115200 baudios
  Serial.begin(115200);
  
  // Retardo para permitir que el sensor se inicialice
  delay(2000);
  
  // Inicializar el sensor DHT
  dht.begin();
  
  // Mensaje inicial
  Serial.println("Inicializando sensor DHT11...");
}

void loop() {
  // Esperar 2 segundos entre lecturas
  delay(2000);

  // Leer humedad
  float humedad = dht.readHumidity();
  
  // Leer temperatura en grados Celsius
  float temperatura = dht.readTemperature();
  
  // Comprobar si las lecturas fallaron
  if (isnan(humedad) || isnan(temperatura)) {
    Serial.println("Error al leer del sensor DHT11");
    return;
  }

  // Imprimir los resultados en el monitor serial
  Serial.print("Humedad: ");
  Serial.print(humedad);
  Serial.print(" %\t");
  
  Serial.print("Temperatura: ");
  Serial.print(temperatura);
  Serial.println(" *C");
}
