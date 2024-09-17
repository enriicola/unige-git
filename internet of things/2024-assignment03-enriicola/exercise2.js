'use strict';

const { request } = require('http');
const { whilst } = require('async');

const port = 8080;
const mainPath = '/?id=';
const devices = 10;

function getSensorValue(id, callback) {
   const req = request({ hostname: 'localhost', port, path: mainPath + id }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => callback(null, JSON.parse(data).value));
   });
   req.on('error', callback);
   req.end();
}

function findFirstDefinedSensor(start_index) {
   whilst(
      cb => cb(null, start_index < devices),
      cb => {
         getSensorValue(start_index, (err, value) => {
            if (err) {
               console.error(`Request failed: ${err.message}`);
               return cb();
            }
            if (!isNaN(value) && value !== null && value !== undefined) {
               console.log({ id: start_index, value: value });
               return cb('stop');
            }
            start_index++;
            cb();
         });
      },
      (err) => {
         if (!err) 
            console.log('no device found');
      }
   );
}

findFirstDefinedSensor(0);