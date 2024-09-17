'use strict';

const { request } = require('http');
const port = 8080;

function checksensor(i){
    const options = {
        hostname: 'localhost',
        port: port,
        path: `/?id=${i}`,
        method: 'GET',
    };
    const req = request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const sensor_data = JSON.parse(data);
            if (sensor_data.value !== null){
                console.log(`{ id: '${sensor_data.id}', value: ${sensor_data.value} }`);
            } else {
                checksensor(i+1);
            }
        });
    });

    req.on('error', error => {
        console.error(`Error with sensor ${i}: ${error.message}`);
        checkSensor(i + 1);
    });

    req.end();
}

checksensor(0);