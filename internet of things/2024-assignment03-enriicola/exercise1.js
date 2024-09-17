'use strict';

const { request } = require('http');
const { parallel } = require('async');

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

parallel(Array.from({ length: devices }, (_, i) => callback => getSensorValue(i, callback)), (err, results) => {
   if (err) {
      console.error(err);
      return;
   }
   results = results.filter(value => !isNaN(value) && value !== null);
   const sortedResults = results.sort((a, b) => a - b);
   // console.log(sortedResults);
   const mid = Math.floor(sortedResults.length / 2);
   const median = sortedResults.length % 2 !== 0 ? sortedResults[mid] : (sortedResults[mid - 1] + sortedResults[mid]) / 2;
   console.log(median);
});