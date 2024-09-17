'use strict';

const { request } = require('http');
const port = 8080;
const devices = 10;
const host = 'localhost';

let values = [];
let requests_done = 0;

for (let i = 0; i < devices; i++) {
    const options = {
        hostname: host,
        port: port,
        path: `/?id=${i}`,
        method: 'GET'
    };

    const req = request(options, res => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            const sensor_data = JSON.parse(data);
            if (sensor_data.value !== null){
                values.push(sensor_data.value);
            }
            
            requests_done++;

            if (requests_done === devices) {
                const sum = values.reduce((acc, val) => acc + val, 0);
                const avg = sum / values.length;
                console.log(avg);
            }
        });
    });

    req.on('error', error => {
        console.error(`Error with sensor ${i}: ${error.message}`);
    });

    req.end();
}
