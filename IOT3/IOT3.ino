const int led1Pin = 4;  // Pin donde conectas el primer LED
const int led1Channel = 0;  // Canal PWM para LED 1
const int pwmFreq = 5000;   // Frecuencia de PWM (5kHz)
const int pwmResolution = 8;  // Resolución de PWM (0-255)

void setup() {
  // Inicializar el puerto serie
  Serial.begin(115200);
  
  // Configurar PWM para el LED
  ledcSetup(led1Channel, pwmFreq, pwmResolution);
  ledcAttachPin(led1Pin, led1Channel);
}

void loop() {
  // Cambiar el brillo del LED (valor entre 0 y 255)
  for (int dutyCycle = 0; dutyCycle <= 255; dutyCycle++) {
    ledcWrite(led1Channel, dutyCycle);
    delay(15);
  }
  for (int dutyCycle = 255; dutyCycle >= 0; dutyCycle--) {
    ledcWrite(led1Channel, dutyCycle);
    delay(15);
  }
}
