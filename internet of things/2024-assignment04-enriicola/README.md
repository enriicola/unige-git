# Assignment 4
## Node.js promises and `async`/`await`

### Exercise 1 with promises
Use promises (but **not** `async`/`await`) to complete the script in `exercise1promise.js` to implement an HTTP client which sends GET requests to a server to get the values of ten different sensors identified by integer numbers from 0 to 9, and then prints the median of them on the standard output. The script should work also in case some requests fail, in case no values could be retrieved the value `NaN` should be printed. 

Assume that the server is the localhost listening on port 8080 and that the path for getting the value from sensor with id `i` is
`/?id=i`. The response of the server is in JSON format.

For instance, by sending the request with path `/?id=5`, the client requests for the value, if any, associated with the sensor 5.
If this value exists, then the response is a JSON object of this form:
```js
'{"id":"5","value":19.54177399909402}'
```

To test your script with a server, run `node server.js assign1.json`, you should get `19.7712977811025` as result.
As a further test, try with `node server.js assign2.json`, you should get `19.7620158858899` as result.

### Exercise 1 with promises and `async`/`await`
Complete the script `exercise1await.js` similarly as done for the previous exercise, but use also `async`/`await` where useful.

### Exercise 2 with promises
Use promises (but **not** `async`/`await`) to complete the script in `exercise2promise.js` to implement an HTTP client that sends the same type of GET requests as in Exercise 1, but this time the client prints the information (if any) on the first sensor, starting from id 0, such that its value is defined. The script should work also in case some requests fail, in case no values could be retrieved the string `no device found` should be printed. 

To test your script with a server, run `node server.js assign2.json`, you should get `{ id: 5, value: 19.54177399909402 }` as result.
As a further test, try with `node server.js assign1.json`, you should get `{ id: '0', value: 19.596276986714056 }` as result.

### Exercise 2 with promises and `async`/`await`
Complete the script `exercise2await.js` similarly as done for the previous exercise, but use also `async`/`await` where useful.
