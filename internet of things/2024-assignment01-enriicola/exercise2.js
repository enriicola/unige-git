'use strict'; 

function stringify(value,p){
    function replacer(k,v){
        // console.log("DEBUG ", k, v);
        if (typeof v === 'object' && !Array.isArray(v)){
            let keys = Object.keys(v).filter(k => p(k));
            let result = {};
            for (let key of keys)
                    result[key] = v[key];

            return result;
        }
        return v;
    }
    return JSON.stringify(value,replacer);
}

console.log(stringify([{ city: 'Milano', air_quality: 'red', temperature: 10 }, { air_quality: 'yellow', 'temperature': 20, 'sea_conditions': 3, city: 'Genova' }], k => k.match(/^[a-z]+$/)));
console.log(stringify([{ city: 'Milano', air_quality: 'red', temperature: 10 }, { air_quality: 'yellow', 'temperature': 20, 'sea_conditions': 3, city: 'Genova' }], k => k.length < 5));


