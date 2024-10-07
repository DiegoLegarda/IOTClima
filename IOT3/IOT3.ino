#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define LED_BUILTIN 2
#define DHTPIN 23       
#define DHTTYPE DHT11   


DHT dht(DHTPIN, DHTTYPE);

// Datos de la red WiFi
const char* ssid = "Legarda_Lujan";      
const char* password = "AnaIsa19";   

// Datos del servidor MQTT
const char* mqtt_server = "192.168.101.79";  
const int mqtt_port = 1883;                     
const char* mqtt_topic = "esp32/dht11";         


WiFiClient espClient;
PubSubClient client(espClient);


void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);

  // Conectarse a la red WiFi
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());
}

// Función para conectarse al broker MQTT
void reconnect() {
 
  while (!client.connected()) {
    Serial.print("Conectando al broker MQTT...");
    // Intentar conectarse
    if (client.connect("ESP32Client")) {
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("Conectado");
    } else {
      Serial.print("Error, rc=");
      Serial.print(client.state());
      Serial.println(" Intentando de nuevo en 5 segundos");
      digitalWrite(LED_BUILTIN, LOW);
      delay(5000);
    }
  }
}

void setup() {

  Serial.begin(115200);  
  pinMode(LED_BUILTIN, OUTPUT);
  dht.begin(); 
  digitalWrite(LED_BUILTIN, HIGH);
  setup_wifi();
  
  client.setServer(mqtt_server, mqtt_port);
  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Leer la temperatura y humedad
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();
Serial.print("Humedad");
Serial.print(humedad);
Serial.print("| Temperatura");
Serial.print(temperatura);

  // Comprobar si la lectura falló
  if (isnan(humedad) || isnan(temperatura)) {
    Serial.println("Error al leer del sensor DHT11");
    return;
  }

 
  String payload = "{\"temperature\": ";
  payload += String(temperatura);
  payload += ", \"humidity\": ";
  payload += String(humedad);
  payload += "}";


  Serial.print("Publicando mensaje: ");
  Serial.println(payload);
  client.publish(mqtt_topic, payload.c_str());

  delay(10000);
}
