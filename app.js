(
  function() {
    "use strict";
    const path = require('path');
    const bodyParser = require('body-parser');



    let express = require('express');

    // Driver Module for MongoDB
    var mongo = require('mongoose');
    // MongoDB connection string
    var mongourl = "mongodb://app:Adv4nc3d-Pr0gr4mm1ng@46.101.207.27:27017/advpro"

    // establishing connection to the Database
    mongo.connect(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Logging whether the connection to the Database worked or logging error
    mongo.connection.once('open', function() {
      console.log('Connected to Database');
    }).on('error', function(error) {
      console.log('error is', error);
    });

    // Adding the Models to our server application
    var NodeSchema = require('./models/node_db');
    var LinkSchema = require('./models/link_db');

    // Initialize express
    let app = express();
    // Setting up the view engine
    app.set('view engine', 'pug');
    // declaring the public folder for frontend
    app.use(express.static(__dirname + '/public'));
    // Setting for bodyParser
    app.use(bodyParser.urlencoded({
      extended: false
    }))

    // Initial controller for the Diagram
    app.get('/', function(req, res) {
      // res.sendFile(path.join(__dirname + '/index.html'));
      res.render('greeting', {})
      console.log("Diagram request complete");
    });

    app.get('/new', function(req, res) {
      res.sendFile(path.join(__dirname + '/index.html'));
      console.log("Diagram request complete");
    });

    // Downloading Data from Database
    app.get('/download', async function(req, res) {

      const nodesInDB = await NodeSchema.find({}, function(err, data) {});
      const linksInDB = await LinkSchema.find({}, function(err, data) {});

      // We have to render the index with pug to pass the variables from the controller to html
      res.render('index', {
        downloadData: nodesInDB,
        downloadLinks: linksInDB
      })

    })

    // Controller for uploading Diagram Nodes and Links
    app.post('/upload', function(req, res) {
      // upload Nodes to the Database
      var dataUpload = req.body.uploadData;

      if (dataUpload.length > 0) {
        const myObj = JSON.parse(dataUpload);
        // Clearing the Database
        NodeSchema.deleteMany({}, function(err) {
          if (err) console.log(err);
        });
        LinkSchema.deleteMany({}, function(err) {
          if (err) console.log(err);
        });

          // Saving nodes in the Database
          for (var i = 0; i < myObj.length; i++) {
            const nodesInDB = new NodeSchema(myObj[i]);
            nodesInDB.save();
          }
      }

      // upload Links to the Database
      var linksUpload = req.body.uploadLinks;
      if (linksUpload.length > 0) {
        const linkObj = JSON.parse(linksUpload);

        // saving links in the Database
        for (var i = 0; i < linkObj.length; i++) {
          const linksInDB = new LinkSchema(linkObj[i]);
          linksInDB.save();
        }
      }

      if (dataUpload.length == 0) {
        console.log("Nothing to upload...")
      } else {
        console.log("Data uploaded to the Database")
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
