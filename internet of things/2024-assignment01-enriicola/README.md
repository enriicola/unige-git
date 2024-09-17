# Assignment 1
## JavaScript  

### Exercise 1
The behavior of `JSON.stringify` can be modified by passing a *replacer* function as second argument
(see the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">documentation</a> for more
details).

As an example of use, see file `stringify.js` where the replacer function does not affect the returned JSON string, but simply prints on the standard output the keys and values that are considered by 'JSON.stringify' during the traversal of the object. 

Complete file `exercise1.js` by defining a `replacer` function so that `stringify(value)` has the same behavior as `JSON.stringify`
except for arrays which have enumerable properties which are not indexes. In this case, the arrays is converted into a corresponding pseudo-array and then stringified.

The execution of `node exercise1.js` should print (ignore new lines and spaces introduced for readability)
```js
{
  "a1":[{"city":"Milano","air_quality":"red","temperature":10},{"air_quality":"yellow","temperature":20,"sea_conditions":3,"city":"Genova"}],
  "a2":{"0":"2","index":0,"input":"2,3,5,7,9,11,13"},
  "a3":["2","3","5","7","9","11","13"]
}
```

### Exercise 2
Complete file `exercise2.js` by defining a `replacer` so that `stringify(o,p)` has the same behavior as `JSON.stringify` but in objects which are not arrays only the properties with the key `k` such that `p(k)` is true are stringified. 

The execution of `node exercise2.js` should print
```js
[{"city":"Milano","temperature":10},{"temperature":20,"city":"Genova"}]
[{"city":"Milano"},{"city":"Genova"}]
```

### Exercise 3
Complete file `exercise3.js` by defining function `toCSV(data)` which converts an array of objects, read from a JSON file, into a CSV table. Each element
in the array `data` corresponds to a single row where the properties of the objects are column values.

For simplicity, the function emits the result on the standard output,
with the comma `','` and the newline as separators for columns and rows, respectively.

The first emitted row is the header of the table, specified by the array in `header.json`. 

Property keys are insensitive to letter case, spaces at the start and end and between words, in this last case as long as there is at least a blank.  
The function tacitly assumes that no name clash can arise. 

The execution of `node exercise3.js` should print
```bash
City,Air Quality,Sea Conditions,Temperature
Genova,yellow,3,20
Milano,red,,10
Torino,red,,8
Imperia,green,2,23
```
corresponding to the table
<table cellspacing="0" border="0">
	<colgroup width="70"></colgroup>
	<colgroup width="93"></colgroup>
	<colgroup width="127"></colgroup>
	<colgroup width="108"></colgroup>
	<tr>
		<td height="21" align="left">City</td>
		<td align="left">Air Quality</td>
		<td align="left">Sea Conditions</td>
		<td align="left">Temperature</td>
	</tr>
	<tr>
		<td height="21" align="left">Genova</td>
		<td align="left">yellow</td>
		<td align="right" sdval="3" sdnum="1033;">3</td>
		<td align="right" sdval="20" sdnum="1033;">20</td>
	</tr>
	<tr>
		<td height="21" align="left">Milano</td>
		<td align="left">red</td>
		<td align="left"><br></td>
		<td align="right" sdval="10" sdnum="1033;">10</td>
	</tr>
	<tr>
		<td height="21" align="left">Torino</td>
		<td align="left">red</td>
		<td align="left"><br></td>
		<td align="right" sdval="8" sdnum="1033;">8</td>
	</tr>
	<tr>
		<td height="21" align="left">Imperia</td>
		<td align="left">green</td>
		<td align="right" sdval="2" sdnum="1033;">2</td>
		<td align="right" sdval="23" sdnum="1033;">23</td>
	</tr>
</table>


