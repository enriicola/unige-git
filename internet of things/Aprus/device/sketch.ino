#include <ESP32Servo.h>
#include <MKL_HCSR04.h> // for ultrasonic sensor
#include "DHT.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <OneWire.h> // for DS18B20
#include <DallasTemperature.h> // for DS18B20

// Pin definitions
#define SERVO_PIN1 33
#define SERVO_PIN2 32
#define LDR_PIN 34
#define LED_PIN 22
#define MOISTURE_PIN 35
#define SOIL_TEMP_PIN 25

// #define PH_PIN 1

#define HC_TRIGGER 12
#define HC_ECHO 14
#define DHT_PIN 4
#define RELAY_PIN 15
#define CONNECTION_SUCCESS_LED 23
#define CONNECTION_FAILURE_LED 19

// MQTT details
#define CLIENT_ID "15"
#define TOPIC "Aprus"
#define SETTINGS_TOPIC "AprusSettings"
#define SSID "Wokwi-GUEST"
#define PASSWORD ""
#define MQTT_SERVER "mqtt.eclipseprojects.io"
#define MQTT_PORT 1883

// Implement struct for threshold values
struct Thresholds
{
  float lux;
  float lux_roof;
  float moisture;
  float tank_distance;
};

// Device objects
Servo servo1;
Servo servo2;
MKL_HCSR04 hc(HC_TRIGGER, HC_ECHO);
DHT dht(DHT_PIN, DHT22);
WiFiClient espClient;
PubSubClient client(espClient);
OneWire oneWire(SOIL_TEMP_PIN); // for DS18B20
DallasTemperature ds(&oneWire);  // for DS18B20

// Initialize default thresholds
Thresholds thresholds = {50.0, 80000.0, 80.0, 70.0}; // Example default values

void setup()
{
  // Initialize Serial
  Serial.begin(9600);

  // Connect to Wi-Fi
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(250);
  }
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Set up MQTT client
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback); // Set callback function for MQTT messages

  // Pin modes
  pinMode(LDR_PIN, INPUT);                 // initialize LDR (Light Dependent Resistor)
  pinMode(LED_PIN, OUTPUT);                // initialize LED to check sunlight
  pinMode(MOISTURE_PIN, INPUT);            // Initialize moisture sensor
  pinMode(CONNECTION_SUCCESS_LED, OUTPUT); // Initialize connection success LED
  pinMode(CONNECTION_FAILURE_LED, OUTPUT); // Initialize connection failure LED
  pinMode(RELAY_PIN, OUTPUT);              // Initialize ultrasonic sensor
  pinMode(SOIL_TEMP_PIN, INPUT);           // Initialize soil temperature sensor
  // pinMode(PH_PIN, INPUT);                  // Initialize pH sensor

  digitalWrite(LED_PIN, LOW);   // turn off LED, initially
  digitalWrite(RELAY_PIN, LOW); // turn off relay, initially

  servo1.attach(SERVO_PIN1); // attach servo to pin
  servo2.attach(SERVO_PIN2); // attach servo to pin

  // initially roof is closed
  servo1.write(90);
  servo2.write(90);

  // Initialize DHT and DS18B20 sensors
  dht.begin();
  ds.begin();

  connect_mqtt();
}

// Getter functions
float get_lux()
{
  const float GAMMA = 0.7;
  const float RL10 = 50;

  int analogValue = analogRead(LDR_PIN);
  analogValue = map(analogValue, 4095, 0, 1024, 0);

  float voltage = analogValue / 1024.0 * 5;
  float resistance = 2000 * voltage / (1 - voltage / 5);
  float lux = pow(RL10 * 1e3 * pow(10, GAMMA) / resistance, (1 / GAMMA));
  return lux;
}
float get_external_humidity()
{
  return dht.readHumidity();
}
float get_external_temperature()
{
  return dht.readTemperature();
}
float get_moisture()
{
  return analogRead(MOISTURE_PIN);
}
float get_soil_temp()
{
  ds.requestTemperatures();
  return ds.getTempCByIndex(0);
}
float get_water_tank_level()
{
  return hc.dist();
}
/*
float get_soil_ph()
{
  // TODO: If the pH sensor isn’t reading anything, verify its connection and calibration. You may need to calibrate or replace the sensor. For debugging, print raw values from the pH sensor to confirm it’s receiving input.
  float rawValue = analogRead(PH_PIN);
  Serial.print("Raw pH value: ");
  Serial.println(rawValue);
  float pH = ((float)rawValue / 4095.0) * 14;
  Serial.println(pH);
  return pH;
}
*/

void connect_mqtt()
{
  if (client.connect(CLIENT_ID))
  {
    client.subscribe(SETTINGS_TOPIC); // Subscribe to settings topic
    client.publish(TOPIC, "Connection successful");
    digitalWrite(CONNECTION_SUCCESS_LED, HIGH);
    digitalWrite(CONNECTION_FAILURE_LED, LOW);
  }
  else
  {
    digitalWrite(CONNECTION_FAILURE_LED, HIGH);
    reconnect();
  }
}

// Virtual infinite loop to reconnect to MQTT
void reconnect()
{
  while (!client.connected())
  {
    Serial.println("Attempting MQTT connection...");
    if (client.connect(CLIENT_ID))
    {
      Serial.println("connected");
      client.subscribe(SETTINGS_TOPIC); // Subscribe to settings topic
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// If there is too much sunlight, turn on the white LED
void check_sunlight()
{
  //if (get_lux() < 20)
  //  Serial.println("Too dark");
  if (get_lux() > thresholds.lux)
    digitalWrite(LED_PIN, LOW);
  else
    digitalWrite(LED_PIN, HIGH);
}

// If there is too much sunlight, close the roof
void manage_roof()
{
  if (get_lux() > thresholds.lux_roof)
  {
    servo1.write(0);
    servo2.write(0);
  }
  else
  {
    servo1.write(90);
    servo2.write(90);
  }
}

void manage_watering()
{
  // digitalWrite(RELAY_PIN, (get_water_tank_level() > 70 && get_moisture() < 80) ? HIGH : LOW);

  // se l'acqua dista meno di 70 cm e l'umidità è minore dell'80% ...
  if (get_water_tank_level() < thresholds.tank_distance && get_moisture() < thresholds.moisture)
    digitalWrite(RELAY_PIN, HIGH); // Attiva l'irrigazione
  else
    digitalWrite(RELAY_PIN, LOW); // Disattiva l'irrigazione
}

void mqtt()
{

  // Create JSON document
  StaticJsonDocument<256> doc;
  doc["id"] = CLIENT_ID;
  doc["lux"] = get_lux();
  doc["humidity"] = get_external_humidity();
  doc["temperature"] = get_external_temperature();
  doc["moisture"] = get_moisture();
  doc["soilTemperature"] = get_soil_temp();
  //doc["pH"] = get_soil_ph();
  doc["tankDistance"] = hc.dist();

  // Serialize JSON document to a string
  char buffer[256];
  size_t n = serializeJson(doc, buffer);

  // Publish the JSON string to the MQTT topic
  client.publish(TOPIC, buffer, n);

  // Serial.println("Sended ;)");
}

void mqtt_for_thresholds(const String &payload)
{
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload);

  if (error)
  {
    Serial.print("Failed to parse thresholds: ");
    Serial.println(error.f_str());
    return;
  }

  if (doc.containsKey("light"))
    thresholds.lux = doc["light"];

  if (doc.containsKey("roof"))
    thresholds.lux_roof = doc["roof"];

  if (doc.containsKey("hum"))
    thresholds.moisture = doc["hum"];
  
  if (doc.containsKey("tank"))
    thresholds.tank_distance = doc["tank"];
  
  Serial.print("Updated thresholds: Lux=");
  Serial.print(thresholds.lux);
  Serial.print(", LuxRoof=");
  Serial.print(thresholds.lux_roof);
  Serial.print(", Moisture=");
  Serial.print(thresholds.moisture);
  Serial.print(", Tank Distance=");
  Serial.println(thresholds.tank_distance);
}

void callback(char *topic, byte *payload, unsigned int length)
{

  Serial.println(topic);

  if (String(topic) == SETTINGS_TOPIC)
  {
    String message;
    for (int i = 0; i < length; i++)
    {
      message += (char)payload[i];
    }

    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, message);
  
    Serial.println(message);

    if (error)
    {
      Serial.print("Failed to parse settings: ");
      Serial.println(error.f_str());
      return;
    }

    if (doc.containsKey("id") && doc["id"].as<String>() == CLIENT_ID)
    {
      mqtt_for_thresholds(message);
    }
  }
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  check_sunlight();
  manage_roof();
  manage_watering();

  mqtt();

  delay(2000);
}
