var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InstanceOfPresetSchema = new Schema({
  linkFrom: {
    type: String
  },
  linkTo: {
    type: String
  },
  presetID: {
    type: String
  },
  diagramId: {
    type: String
  }
});



module.exports = mongoose.model('InstanceOfPresetdb', InstanceOfPresetSchema);
