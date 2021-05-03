
// Hole das Module
const log = require('./logger')

// This give information about the path
const path = require('path');

// This save the path in a var
var pathObj = path.parse(__filename);

// console.log(logger);
// This is a private function, app.js dont now about the logger file
log('message');

function sayHello(name){
	console.log('Hello ' + name);
}

sayHello('Jan');

// Path in the console
console.log(pathObj);
