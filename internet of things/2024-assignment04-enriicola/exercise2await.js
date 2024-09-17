'use strict';

const { request } = require('http');
const port = 8080;
const mainPath = '/?id=';
const devices = 10;

async function getSensorValue(i) {
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
                  resolve(parsedData.value);
               } catch (e) {
                  resolve(NaN);
               }
         });
      });

      req.on('error', reject);
      req.end();
   });
}

async function findFirstDefinedSensor() {
   for (let i = 0; i < devices; i++) {
      try {
         const value = await getSensorValue(i);
         if (!isNaN(value) && value !== null && value !== undefined) {
            console.log({ id: i, value: value });
            return;
         }
      } catch (err) {
         console.error(`Request failed: ${err.message}`);
      }
   }
   console.log('no device found');
}

findFirstDefinedSensor();