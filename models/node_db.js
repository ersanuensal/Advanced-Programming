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
    enum: ['COTS', 'Proprietary', 'Undefined'],
    default: 'Undefined'
  },
  Release: {
    type: String
  },
  Shutdown: {
    type: String
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
  },
  diagramId: {
    type: String
  }
});

module.exports = mongoose.model('Nodedb', NodeSchema)
