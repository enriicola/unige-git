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

async function main() {
   let values = [];
   for (let i = 0; i < devices; i++) {
      try {
         const value = await getSensorValue(i);
         if (!isNaN(value)) 
               values.push(value);
      } catch (err) {
         console.error(`Request failed: ${err.message}`);
      }
   }

   values.sort((a, b) => a - b);
   values = values.filter(element => element !== null);
   const mid = Math.floor(values.length / 2);
   const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
   console.log(isNaN(median) ? 'NaN' : median);
}

main();