// console.log(__filename);
// console.log(__dirname);
// node convert this to a function and dont execute this code directly
var url = 'http://mylogger.io/log';

function log(message){

    // Send an HTTP request
    console.log(message);

}

module.exports = log;
