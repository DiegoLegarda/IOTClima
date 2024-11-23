#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include "config.h"  // Archivo con credenciales de WiFi y MQTT
#define LED_BUILTIN 2
#define PIN_HUMEDAD_SUELO 34

// Pines para LEDs controlados por PWM
const int led1Pin = 12;  
const int led2Pin = 13;  
const int led1Channel = 0;  // Canal PWM para LED 1
const int led2Channel = 1;  // Canal PWM para LED 2
const int pwmFreq = 5000;   // Frecuencia de PWM (5kHz)
const int pwmResolution = 8;  // Resolución de PWM (0-255)

// Definiciones para DHT11
#define DHTPIN 23  // Pin donde está conectado el DHT11
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// Variables para MQTT
const char* mqtt_topic = "esp32/dht11";          // Canal para datos de DHT11
const char* control_topic = "esp32/ledControl";  // Canal para control de LEDs

WiFiClient espClient;
PubSubClient client(espClient);

// Función para conectar a la red WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
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

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("Mensaje recibido en el tema ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message);

  // Controlar los mensajes según el tema (tópico) recibido
  if (String(topic) == "esp32/dht11") {
    // Procesar datos de temperatura y humedad
    DynamicJsonDocument doc(200);
    deserializeJson(doc, message);

    float temperature = doc["temperature"];
    float humidity = doc["humidity"];
    float soil_moisture=doc["soil_moisture"];
    Serial.print("Temperatura: ");
    Serial.println(temperature);
    Serial.print("Humedad: ");
    Serial.println(humidity);
    Serial.print("Humedad suelo: ");
    Serial.println(soil_moisture);

  } else if (String(topic) == "esp32/ledControl") {
     DynamicJsonDocument doc(200);
    deserializeJson(doc, message);

    int pwmValue1 = doc["led1"];  
    int pwmValue2 = doc["led2"];  

    ledcWrite(led1Channel, pwmValue1);
    ledcWrite(led2Channel, pwmValue2);

    Serial.print("LED1 PWM: ");
    Serial.println(pwmValue1);
    Serial.print("LED2 PWM: ");
    Serial.println(pwmValue2);
  }
}

// Función para reconectar al servidor MQTT
void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando al broker MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado");
      client.subscribe(control_topic);
      digitalWrite(LED_BUILTIN, HIGH);  
    } else {
      Serial.print("Error, rc=");
      Serial.print(client.state());
      Serial.println(" Intentando de nuevo en 5 segundos");
      digitalWrite(LED_BUILTIN, LOW);
      delay(5000);
    }
  }
}

// Publicar datos de temperatura y humedad
void publishData() {
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();
  int valorHumedad = analogRead(PIN_HUMEDAD_SUELO);
  float porcentajeHumedad = map(valorHumedad, 0, 4095, 0, 100);

  if (isnan(humedad) || isnan(temperatura)) {
    Serial.println("Error al leer del sensor DHT11");
    return;
  }
  if(isnan(valorHumedad)){
    Serial.println("Sensor de Humedad del suelo sin datos");
    }

  String payload = "{\"temperature\": ";
  payload += String(temperatura);
  payload += ", \"humidity\": ";
  payload += String(humedad);
  payload += ", \"soil_moisture\": ";
  payload += String(porcentajeHumedad);
  payload += "}";

  Serial.print("Publicando mensaje: ");
  digitalWrite(LED_BUILTIN, HIGH); 
  Serial.println(payload);
  client.publish(mqtt_topic, payload.c_str());  
}

void setup() {
  Serial.begin(115200);
  
  // Configurar los pines de los LEDs como salidas PWM
  ledcSetup(led1Channel, pwmFreq, pwmResolution);
  ledcSetup(led2Channel, pwmFreq, pwmResolution);
  ledcAttachPin(led1Pin, led1Channel);
  ledcAttachPin(led2Pin, led2Channel);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  delay(3000);
  digitalWrite(LED_BUILTIN, LOW);
  dht.begin(); 
  setup_wifi();
  
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);  // Registrar la función callback para recibir mensajes MQTT

  reconnect();
  
}


void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();  // Asegúrate de que esta línea se ejecuta con frecuencia

  // Publicar datos de temperatura y humedad cada 10 segundos
  static unsigned long lastPublishTime = 0;
  unsigned long currentMillis = millis();
  if (currentMillis - lastPublishTime >= 10000) {
    publishData();  // Publicar datos cada 10 segundos
    lastPublishTime = currentMillis;
  }
}
