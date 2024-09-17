// Example 3 (works with files of arbitrary size, continued)
function copy(res, cb) {
   let bytesRead = res.read[0]; // res.read[0]=bytesRead, res.read[1]=buffer
   whilst(
      cb => cb(null, bytesRead > 0), // test, no error occurs
      copyStep, // iteratee
      cb // final callback
   ); // end whilst
   function copyStep(cb) { // nested in function copy
      ; 
   }
}