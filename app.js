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
    var LinkSchema = require('./models/link_db')


    let app = express();
    app.set('view engine', 'pug');
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({ extended: false }))

    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/index.html'));
      console.log("Diagram request complete");
    });

    app.get('/download', async function(req, res) {
      // res.redirect('/');
    const nodesInDB = await NodeSchema.find({}, function(err, data) {});
    const linksInDB = await LinkSchema.find({}, function(err, data) {});
    //   NodeSchema.find({}, function(err, data){
    //     res.render('index', {downloadData: data});
    // });
    res.render('index', {downloadData: nodesInDB, downloadLinks: linksInDB})
    })

    app.post('/upload', function(req, res) {
      // upload Nodes to the Database
      var dataUpload = req.body.uploadData;

      if (dataUpload.length > 0) {
        const myObj = JSON.parse(dataUpload);
        NodeSchema.deleteMany({}, function (err) {
          if(err) console.log(err);
        });
        LinkSchema.deleteMany({}, function (err) {
          if(err) console.log(err);
        });

        for (var i = 0; i < myObj.length; i++) {
          const nodesInDB = new NodeSchema(myObj[i]);
          nodesInDB.save();
        }
      }

      // upload Links to the Database
      var linksUpload = req.body.uploadLinks;
      if (linksUpload.length > 0) {
        const linkObj = JSON.parse(linksUpload);

        for (var i = 0; i < linkObj.length; i++) {
          const linksInDB = new LinkSchema(linkObj[i]);
          linksInDB.save();
        }
      }

      if (dataUpload.length == 0) {
        console.log("Nothing to upload...")
      }else {
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
