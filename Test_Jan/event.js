// events listen to new request, like http Module

//load event module
// EventEmitter is written with upper case, because it is a Class and not a function
// class is a container for properties and methodes
const EventEmitter = require('events');

// instant of this class
// emitter is a object
// const emitter = new EventEmitter();



// this object has a bunch of methodes
// emit means: making a noise, produce - signaling
// raise an event
// emitter.emit('messageLogged', { id: 1, url: 'http://'});

const Logger = require('./logger');
const logger = new Logger();

// Register a listener
// message and Callback
logger.on('messageLogged', (eventArg) => {
  console.log('Listener called', eventArg);

});

logger.log('message');
