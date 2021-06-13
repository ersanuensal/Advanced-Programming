var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LinkSchema = new Schema({
  from: {
    type: Number,
    required: true
  },
  to: {
    type: Number,
    required: true
  },
  Name: {
    type: String
  },
  Description: {
    type: String
  },
  Color: {
    type: String
  },
  PersonalData: {
    type: Boolean
  },
  LoadPreset: {
    type: String
  }
});



module.exports = mongoose.model('Linkdb', LinkSchema);
