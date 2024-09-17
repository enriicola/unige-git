import paho.mqtt.client as mqtt
import json
import time
import random

# MQTT details
CLIENT_ID = "Aprus_Python_clientID"
TOPIC = "Aprus"
MQTT_SERVER = "mqtt.eclipseprojects.io"
MQTT_PORT = 1883

# Function to generate uniformly increasing or decreasing values
def generate_uniform_values(step, max_steps, current_step):
    factor = current_step / max_steps
    return {
        "id": random.randint(1, 2),  # Simulate device ID between 1 and 100
        "lux": 20000 * factor,  # Simulate lux value between 0 and 20000
        "humidity": 20 + (80 * factor),  # Simulate humidity value between 20% and 100%
        "temperature": -10 + (60 * factor),  # Simulate temperature value between -10°C and 50°C
        "moisture": 1024 * factor,  # Simulate soil moisture value between 0 and 1024
        "tankDistance": 100 * factor  # Simulate tank distance value between 0 and 100 cm
    }


# Function to connect to MQTT broker
def connect_mqtt():
    client = mqtt.Client(CLIENT_ID)
    client.connect(MQTT_SERVER, MQTT_PORT)
    return client

# Function to publish data to MQTT broker
def publish(client):
    max_steps = 30
    current_step = 0
    increasing = True

    while True:
        data = generate_uniform_values(1, max_steps, current_step)
        payload = json.dumps(data)
        client.publish(TOPIC, payload)
        print(f"Published: {payload}")

        if increasing:
            current_step += 1
            if current_step > max_steps:
                current_step = max_steps - 1
                increasing = False
        else:
            current_step -= 1
            if current_step < 0:
                current_step = 1
                increasing = True

        time.sleep(1)  # Adjust the delay to control how fast the values change

if __name__ == "__main__":
    client = connect_mqtt()
    publish(client)
