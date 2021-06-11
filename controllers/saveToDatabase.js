var mongo = require('mongoose');
var mongourl = "mongodb://app:Adv4nc3d-Pr0gr4mm1ng@46.101.207.27:27017/advpro"

mongo.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongo.connection.once('open', function () {
  console.log('Connected to Database');
}).on('error', function (error) {
  console.log('error is', error);
});

var NodeSchema = require('./models/node_db');

const nodesInDB = new NodeSchema({
  Name: 'test',
  Version: '1.0',
  Description: 'hier steht beschreibung',
  COTS: 'COTS',
  Release: '2021-01-01',
  Shutdown: '2021-02-01',
  color: 'green',
  figure: 'Subroutine',
  key: -1,
  location: 'position'
});

nodesInDB.save();
