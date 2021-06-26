var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DataObjSchema = new Schema({
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
  time: {
    type: String
  },
  diagramId: {
    type: String
  }
});



module.exports = mongoose.model('DataObjdb', DataObjSchema);
