'use strict';

function replacer(key,value){
    console.log(`key:${JSON.stringify(key)} value:${JSON.stringify(value)}`);
    return value;
}

JSON.stringify({x:1,y:{v:0,d:true}},replacer);
console.log('*********');
JSON.stringify([{city:'Milano',air_quality:'red',temperature:10},{air_quality:'yellow','temperature':20,'sea_conditions':3,city:'Genova'}],replacer);

