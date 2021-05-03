
// Hole das Module
const log = require('./logger')

// console.log(logger);
// This is a private function, app.js dont now about the logger file
log('message');

function sayHello(name){
	console.log('Hello ' + name);
}

sayHello('Jan');
