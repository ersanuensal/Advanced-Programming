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
  Color: {
    type: String
  },
  PersonalData: {
    type: Boolean
  }
});



module.exports = mongoose.model('Linkdb', LinkSchema);
