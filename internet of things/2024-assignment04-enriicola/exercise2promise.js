'use strict';

const { request } = require('http');
const port = 8080;
const mainPath = '/?id=';
const devices = 10;

function getSensorValue(i) {
   return new Promise((resolve, reject) => {
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
                  resolve(parsedData);
               } catch (e) {
                  resolve(null);
               }
         });
      });

      req.on('error', reject);
      req.end();
   });
}

function findFirstDefinedSensor(i) {
   if (i >= devices) {
      console.log('no device found');
      return;
   }

   getSensorValue(i)
      .then(sensorData => {
         
         if (sensorData && sensorData.value !== undefined && sensorData.value !== null) 
            console.log({ id: i, value: sensorData.value });
         else
            findFirstDefinedSensor(i + 1);
      })
      .catch(err => console.error(`Request failed: ${err.message}`));
}

findFirstDefinedSensor(0);