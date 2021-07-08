var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SheetSchema = new Schema({
  SheetName: {
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
  },
  appKey: {
    type: String
  }
});

module.exports = mongoose.model('Sheetdb', SheetSchema)
