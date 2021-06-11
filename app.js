(
  function() {
    "use strict";
    const path = require('path');
    const bodyParser = require('body-parser');



    let express = require('express');

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

    var NodeSchema = require('./models/node_db');


    let app = express();

    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded());

    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/index.html'));
      console.log(req.nodeList);

    });

    app.post('/upload', function(req, res) {
      var dataUpload = req.body.uploadData;
      const myObj = JSON.parse(dataUpload);

      for (var i = 0; i < myObj.length; i++) {
        const nodesInDB = new NodeSchema(myObj[i]);

        nodesInDB.save();
      }

    });

    /**
     * when the user wants o import existing application from a csv file
     */
    const excelReader = require('./routes/importAppsFromExcel');
    app.use('/importAppsFromExcel', excelReader);

    let server = app.listen(3000, function() {
      console.log('Express server listening on port ' + server.address().port);
    });
    module.exports = app;
  }()
);
