
// Hole das Module
const log = require('./logger')

// This give information about the path
const path = require('path');

// This is for the OS information
const os = require('os');

// working with the filesystem
// should working with async, because they are none blocking
const fs = require('fs');

// This save the path in a var
var pathObj = path.parse(__filename);

var totalMemory = os.totalmem();
var freeMemory = os.freemem();



// console.log(logger);
// This is a private function, app.js dont now about the logger file
log('message');

function sayHello(name){
	console.log('Hello ' + name);
}

sayHello('Jan');

// Path in the console
console.log(pathObj);

// console.log('Total Memory: ' + totalMemory);

// Template String
// ES6 / ES2015 : ECMAScript 6 -> Define what features availble on javascript

// in $ is an argument
console.log(`Total Memory: ${totalMemory}`);
console.log(`Free Memory: ${freeMemory}`);


// Sync
// const files = fs.readdirSync('./');
// console.log(files);

// async, has a callback function at the end
fs.readdir('./', function(err, files) {
	// Erros not handle with console, error handling coming soon
	if (err) console.log('Error', err);
	//files is a string array
	else console.log('Result', files);
});
