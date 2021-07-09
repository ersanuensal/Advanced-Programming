var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SheetSchema = new Schema({
  name: {
    type: String
  },
  appKey: {
    type: String
  },
  appName: {
    type: String
  },
  appDescription: {
    type: String
  },
  appCOTS: {
    type: String
  },
  appReleaseDate: {
    type: String
  },
  appShutdownDate: {
    type: String
  }
});

module.exports = mongoose.model('Sheetdb', SheetSchema)
