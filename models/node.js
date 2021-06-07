var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NodeSchema = new Schema({
  Name: {
    type: String
  },
  Version: {
    type: String
  },
  Description: {
    type: String
  },
  COTS: {
    type: String,
    required: true,
    enum: ['COTS', 'Proprietary', 'Undefined'],
    default: 'Undefined'
  },
  Release: {
    type: Date
  },
  Shutdown: {
    type: Date
  },
  color: {
    type: String,
    required: true,
    enum: ['blue', 'green', 'red', 'orange'],
    default: 'blue'
  },
  figure: {
    type: String,
    required: true,
    enum: ['Subroutine'],
    default: 'Subroutine'
  },
  key: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Node', NodeSchema)
