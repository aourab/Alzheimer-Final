#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char *ssid = "Uranium";
const char *password = "worldOfPigs";
const char *mqtt_server = "192.168.10.52";

const int analogPin = A0;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Connect to MQTT broker
  client.setServer(mqtt_server, 1883);
}

void loop() {
  // Reconnect to MQTT if connection is lost
  if (!client.connected()) {
    Serial.println("Connecting to MQTT broker...");
    if (client.connect("NodeMCUClient")) {
      Serial.println("Connected to MQTT broker");
    }
  }

  // Read analog data
  int analogValue = analogRead(analogPin);

  // Publish analog data to MQTT topic
  client.publish("analog_data", String(analogValue).c_str());

  // Wait for a short time
  delay(1000);

  static unsigned long startTime = millis();

  // Run for 300 seconds (5 minutes)
  if (millis() - startTime >= 300000) {
    Serial.println("Program completed.");
    while (1);  // Infinite loop to stop further execution
  }
}
