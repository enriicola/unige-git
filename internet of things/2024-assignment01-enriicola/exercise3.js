'use strict';
const header = require('./header.json');
const data = require('./weather.json');

function toCSV(data){
    // let headerString = header.join(',');
    // console.log(headerString);

    // console.log(data.map(row => {
    //     return header.map(col => {
    //         return row[col] || row[col.toLowerCase()] || row[col.toUpperCase()] || row[col.trim()] || row[col.trim().toLowerCase()] || row[col.trim().toUpperCase()];
    //     }).join(',');
    // }).join('\n'));

    // let filters = headerString.toLowerCase().split(',');

    // data = JSON.stringify(data).toLowerCase();
    // console.log(data);
    // for (let i = 0; i < data.length; i++) {
    //     console.log(Object.keys(data[i]));
    // }
    
    //-----------------------------------------------
    let csv = '';
    csv += header.join(',') + '\n';

    data.forEach((row) => {
        let rowArray = header.map((key) => {
            let tempKey = Object.keys(row).find(x => x.replace(/\s+/g, ' ').trim().toLowerCase() === key.replace(/\s+/g, ' ').toLowerCase());
            return tempKey ? row[tempKey] : '';
        });
        csv += rowArray.join(',') + '\n';
    });
    
    console.log(csv);
    return csv;

}

toCSV(data);