'use strict';

const { request } = require('http');
const { isNull } = require('util');
const port = 8080;
const mainPath = '/?id=';
const devices = 10;

let promises = Array.from({length: devices}, (_, i) => new Promise((resolve, reject) => {
    const req = request({
        hostname: 'localhost',
        port: port,
        path: mainPath + i,
        method: 'GET',
    }, res => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                resolve(parsedData.value);
            } catch (e) {
                resolve(NaN);
            }
        });
    });

    req.on('error', reject);
    req.end();
}));

Promise.all(promises)
    .then(values => {
        values = values.filter(value => !isNaN(value)).sort((a, b) => a - b);
        values = values.filter(element => element !== null);

        const mid = Math.floor(values.length / 2);
        const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
        // console.log(values);
        console.log(isNaN(median) ? 'NaN' : median);
    })
    .catch(err => console.error(`Request failed: ${err.message}`));