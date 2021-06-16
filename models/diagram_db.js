var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DiagramSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});



module.exports = mongoose.model('Diagramdb', DiagramSchema);
