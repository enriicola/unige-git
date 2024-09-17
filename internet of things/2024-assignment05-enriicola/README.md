# Assignment 5
## MQTT and Node-RED

### Exercise 1
Complete the script `exercise1.js` to simulate a device which publishes data contained in file `room328.txt.gz` 
on an MQTT server with an interval of 1 second.
Data are in JSON format, and separated by newlines.

Verify the correct behavior with QoS 0, 1, and 2, when the network is down for some time.

### Exercise 2
Implement with Node-RED a dashboard which visualizes the current average values for temperature, humidity and pressure published by the device simulated in the previous exercise.
