'use strict';

function indexIsNotNumeric(value) {
    let keys = Object.keys(value);
    for(let key of keys)
        if(isNaN(key))
            return true;
    return false;
}

function stringifyy(value) {
    function replacer(k, v) {
        // console.log("DEBUG ", k, v);
        // if(Array.isArray(v) && indexIsNotNumeric(v))
        //     return Object.keys(v).reduce((acc, k) => {acc[k]=v[k]; return acc}, {});
        if(Array.isArray(v) && v.length != Object.keys(v).length)
            return Object.keys(v).reduce((acc, k) => {acc[k]=v[k]; return acc}, {});


        return v;
    }
    return JSON.stringify(value, replacer);
}

let a1 = [{ city: 'Milano', air_quality: 'red', temperature: 10 }, { air_quality: 'yellow', 'temperature': 20, 'sea_conditions': 3, city: 'Genova'}];
let a2 = '2,3,5,7,9,11,13'.match(/\d+/);
let a3 = '2,3,5,7,9,11,13'.match(/\d+/g);
let a = [1,2,3]
a["5e7"] = 3

console.log(stringifyy({a1,a2,a3,a}));

// console.log(JSON.stringify({title:"Blade Runner",year:1982}));