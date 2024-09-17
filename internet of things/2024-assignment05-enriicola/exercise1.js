'use strict';

const { connect } = require('mqtt');
const { createReadStream } = require('fs');
const { Transform, pipeline } = require('stream');
const { createGunzip } = require('zlib');

const server = 'mqtt://212.78.1.205';
const topic = 'unige/dibris/iot23/assignment05';
const port = 1883;
const username = 'studenti';
const password = 'studentiDRUIDLAB_1';
const path = process.argv[2] || './room328.txt.gz'; // path to the data
const interval = 1000;
const qos = parseInt(process.argv[3], 10) || 0; // QoS level as a command-line argument (default 0)

const client = connect(server, { port, username, password });
const buffer = [];

client.on('connect', () => {
    console.log('Connected to the MQTT broker');

    const readStream = createReadStream(path);
    const gunzip = createGunzip();
    const transformStream = new Transform({
        readableObjectMode: true,
        transform(chunk, encoding, callback) {
            const data = chunk.toString();
            const lines = data.split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    try {
                        const parsedLine = JSON.parse(line);
                        buffer.push(parsedLine);
                    } catch (e) {
                        console.error('Failed to parse line:', line, e);
                    }
                }
            });
            callback();
        }
    });

    pipeline(readStream, gunzip, transformStream, (err) => {
        if (err) {
            console.error('Pipeline failed', err);
        } else {
            console.log('Pipeline succeeded');
        }
    });

    setInterval(() => {
        if (buffer.length > 0) {
            const message = buffer.shift();
            client.publish(topic, JSON.stringify(message), { qos }, (err) => {
                if (err) {
                    console.error(`Failed to publish message: ${message}`, err);
                } else {
                    console.log(`Published: ${JSON.stringify(message)} with QoS ${qos}`);
                }
            });
        }
    }, interval);
});

client.on('error', (error) => {
    console.error('Error:', error);
    client.end();
});

// Simulate network down by disconnecting and reconnecting after some time
setTimeout(() => {
    console.log('Simulating network down...');
    client.end();
}, 20000); // Disconnect after 20 seconds

setTimeout(() => {
    console.log('Reconnecting to the MQTT broker...');
    client.reconnect();
}, 40000); // Reconnect after 40 seconds
