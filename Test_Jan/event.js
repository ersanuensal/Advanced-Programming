// events listen to new request, like http Module

//load event module
// EventEmitter is written with upper case, because it is a Class and not a function
// class is a container for properties and methodes
const EventEmitter = require('events');

// instant of this class
// emitter is a object
const emitter = new EventEmitter();

// Register a listener
// message and Callback
emitter.on('messageLogged', function() {
  console.log("Listener called");

});

// this object has a bunch of methodes
// emit means: making a noise, produce - signaling
// raise an event
emitter.emit('messageLogged');
