var express = require('express');
var router = express.Router();


var saveToDatabase_controller = require('../controllers/saveToDatabase')


//POST request to save Data to Database.
router.get('/saveToDatabase', saveToDatabase_controller.save)
