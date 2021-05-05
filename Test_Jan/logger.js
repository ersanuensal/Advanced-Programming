// console.log(__filename);
// console.log(__dirname);
// node convert this to a function and dont execute this code directly
const EventEmitter = require('events');

var url = 'http://mylogger.io/log';

class Logger extends EventEmitter {

  log(message){
      // Send an HTTP request
      console.log(message);
      // Rause an event
      this.emit('messageLogged', { id: 1, url: 'http://'});

  }
}


module.exports = Logger;
