(
  function() {
    "use strict";
    const path = require('path');

    let express = require('express');

    let app = express();

    var mongo = require('mongoose');
    var mongourl = "mongodb://app:Adv4nc3d-Pr0gr4mm1ng@46.101.207.27:27017/advpro"

    mongo.connect(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    mongo.connection.once('open', function() {
      console.log('Connected to Database');
    }).on('error', function(error) {
      console.log('error is', error);
    });


    app.use(express.static(__dirname + '/public'));

    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/index.html'));
      console.log("testing express")

    });
    let server = app.listen(3000, function() {
      console.log('Express server listening on port ' + server.address().port);
    });
    module.exports = app;
  }()
);
