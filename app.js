(function () {
	"use strict";
	const path = require("path");
	const bodyParser = require("body-parser");
	let express = require("express");
	var fs = require("fs");
	var connectionBoolean = true;

	// Driver Module for MongoDB
	var mongo = require("mongoose");

	async function connectToDatabase() {
		// MongoDB connection string
		var savedConnectionString = fs.readFileSync("./config.json"),
			connectionObj;
		try {
			connectionObj = JSON.parse(savedConnectionString);
			var connectionString =
				"mongodb://" +
				connectionObj.username +
				":" +
				connectionObj.password +
				"@" +
				connectionObj.endpoint +
				":" +
				connectionObj.port +
				"/" +
				connectionObj.database;
		} catch (err) {
			console.log(err);
		}

		// var mongourl = "mongodb://app:Adv4nc3d-Pr0gr4mm1ng@46.101.207.27:27017/advpro"
		var mongourl = connectionString;

		console.log("trying to connect to " + connectionString + " ...");
		// establishing connection to the Database
		await mongo.connect(mongourl, {
			serverSelectionTimeoutMS: 3000,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		// Logging whether the connection to the Database worked or logging error
		await mongo.connection
			.once("open", function () {
				console.log("Connected to Database");
			})
			.on("error", function (error) {
				console.log("error is", error);
				// connectionBoolean = false;
			});
	}

	// Adding the Models to our server application
	var NodeSchema = require("./models/node_db");
	var LinkSchema = require("./models/link_db");
	var DiagramSchema = require("./models/diagram_db");
	var DataObjSchema = require("./models/dataobj_db");
	var InstanceOfPresetSchema = require("./models/instanceOfPreset_db");
	var SheetSchema = require("./models/sheetsMemory_db");

	// Initialize express
	let app = express();
	// Setting up the view engine
	app.set("view engine", "pug");
	// declaring the public folder for frontend
	app.use(express.static(__dirname + "/public"));
	// Setting for bodyParser
	app.use(
		bodyParser.urlencoded({
			extended: false,
		})
	);

	app.use(express.json());

	// Initial controller for the Diagram
	app.get("/", function (req, res) {
		var savedConnectionString = fs.readFileSync("./config.json"),
			connectionObj;
		try {
			connectionObj = JSON.parse(savedConnectionString);
		} catch (err) {
			console.log(err);
		}
		res.render("connect", {
			loadedEndpoint: connectionObj.endpoint,
			loadedUsername: connectionObj.username,
			loadedPassword: connectionObj.password,
			loadedPort: connectionObj.port,
			loadedDatabase: connectionObj.database,
			errMsg: connectionBoolean,
		});
	});

	app.get("/greeter", async function (req, res) {
		await connectToDatabase();
		if (connectionBoolean == false) {
			res.render("newgreeting");
		} else {
			const diagramsList = await DiagramSchema.find(
				{},
				function (err, data) {}
			);
			res.render("newgreeting", {
				diagramsList: diagramsList,
			});
			console.log("Diagramlist loaded.");
		}
	});

	app.get("/template", function (req, res) {
		res.render("template", {});
	});

	app.get("/test", function (req, res) {
		res.render("newgreeting", {});
	});

	app.get("/new=:diagramName", async function (req, res) {
		var newDiagram = req.params.diagramName;
		var diagramObj = new Object({
			name: newDiagram,
		});
		const newDiagramInDB = new DiagramSchema(diagramObj);

		newDiagramInDB.save();

		const newDiagramID = await DiagramSchema.find(
			{
				name: newDiagram,
			},
			function (err, data) {}
		);

		console.log(
			"New Diagram with ID: " + newDiagramID[0]._id + " has been created."
		);

		res.redirect("/edit=" + newDiagramID[0]._id);
	});

	app.get("/edit=:diagramId", async function (req, res) {
		var diagramId = req.params.diagramId;
		const nodesInDB = await NodeSchema.find(
			{
				diagramId: diagramId,
			},
			function (err, data) {}
		);
		const linksInDB = await LinkSchema.find(
			{
				diagramId: diagramId,
			},
			function (err, data) {}
		);
		const dataObjInDB = await DataObjSchema.find(
			{
				diagramId: diagramId,
			},
			function (err, data) {}
		);
		const instnceOfPresetInDB = await InstanceOfPresetSchema.find(
			{
				diagramId: diagramId,
			},
			function (err, data) {}
		);

		console.log("Diagram with ID: " + diagramId + " has been loaded.");

		// We have to render the index with pug to pass the variables from the controller to html
		res.render("index", {
			downloadData: nodesInDB,
			downloadLinks: linksInDB,
			downloadDataObj: dataObjInDB,
			downloadInstanceOfPreset: instnceOfPresetInDB,
			diagramId: diagramId,
		});
	});

	app.get("/delete=:diagramId", async function (req, res) {
		var diagramId = req.params.diagramId;

		// Clearing the Database
		NodeSchema.deleteMany(
			{
				diagramId: diagramId,
			},
			function (err) {
				if (err) console.log(err);
			}
		);
		LinkSchema.deleteMany(
			{
				diagramId: diagramId,
			},
			function (err) {
				if (err) console.log(err);
			}
		);
		InstanceOfPresetSchema.deleteMany(
			{
				diagramId: diagramId,
			},
			function (err) {
				if (err) console.log(err);
			}
		);
		DiagramSchema.findByIdAndDelete(diagramId, function (err) {
			if (err) console.log(err);
		});

		console.log("Diagram with ID: " + diagramId + " has been deleted.");

		res.redirect("/greeter");
	});

	// Downloading Data from Database
	app.get("/download", async function (req, res) {
		const nodesInDB = await NodeSchema.find({}, function (err, data) {});
		const linksInDB = await LinkSchema.find({}, function (err, data) {});

		// We have to render the index with pug to pass the variables from the controller to html
		res.render("index", {
			downloadData: nodesInDB,
			downloadLinks: linksInDB,
		});
	});

	app.post("/settings", function (req, res) {
		var connectionString = JSON.stringify(req.body);
		fs.writeFile("./config.json", connectionString, function (err) {
			if (err) {
				console.log(err.message);
				return;
			}
			console.log("New settings saved successful!");

			mongo.disconnect();
		});
	});

	app.post("/updateDataObj", function (req, res) {
		var diagramId = req.body.diagramId;

		DataObjSchema.deleteMany(
			{
				diagramId: diagramId,
			},
			function (err) {
				if (err) console.log(err);
			}
		);

		// upload DataObj to the Database
		var dataObjUpload = req.body.uploadDataObj;
		if (dataObjUpload.length > 0) {
			const dataObj = JSON.parse(dataObjUpload);

			// saving DataObj in the Database
			for (var i = 0; i < dataObj.length; i++) {
				const dataObjInDB = new DataObjSchema(dataObj[i]);
				// dataObjInDB.isNew = false;
				dataObjInDB.save();
				console.log("DataObj has been updated");
			}
		}
		if (dataObjUpload.length == 0) {
			console.log("Nothing to upload...");
		} else {
			console.log("Diagram with ID: " + diagramId + " has been updated.");
		}

		res.redirect("/edit=" + diagramId);
	});

	// Controller for uploading Diagram Nodes and Links
	app.post("/upload", function (req, res) {
		// upload Nodes to the Database
		var dataUpload = req.body.uploadData;
		var diagramId = req.body.diagramId;

		if (dataUpload.length > 0) {
			const myObj = JSON.parse(dataUpload);
			// Clearing the Database
			NodeSchema.deleteMany(
				{
					diagramId: diagramId,
				},
				function (err) {
					if (err) console.log(err);
				}
			);
			LinkSchema.deleteMany(
				{
					diagramId: diagramId,
				},
				function (err) {
					if (err) console.log(err);
				}
			);
			DataObjSchema.deleteMany(
				{
					diagramId: diagramId,
				},
				function (err) {
					if (err) console.log(err);
				}
			);
			InstanceOfPresetSchema.deleteMany(
				{
					diagramId: diagramId,
				},
				function (err) {
					if (err) console.log(err);
				}
			);

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

		// upload DataObj to the Database
		var dataObjUpload = req.body.uploadDataObj;
		if (dataObjUpload.length > 0) {
			const dataObj = JSON.parse(dataObjUpload);

			// saving DataObj in the Database
			for (var i = 0; i < dataObj.length; i++) {
				const dataObjInDB = new DataObjSchema(dataObj[i]);
				dataObjInDB.save();
			}
		}

		// upload instances to the Database
		var instanceOfPresetUpload = req.body.uploadInstanceOfPreset;
		if (instanceOfPresetUpload.length > 0) {
			const instanceObjs = JSON.parse(instanceOfPresetUpload);

			// saving instances in the Database
			for (var i = 0; i < instanceObjs.length; i++) {
				const instanceObjsInDB = new InstanceOfPresetSchema(instanceObjs[i]);
				instanceObjsInDB.save();
			}
		}

		if (dataUpload.length == 0) {
			console.log("Nothing to upload...");
		} else {
			console.log("Diagram with ID: " + diagramId + " has been updated.");
		}

		res.redirect("/edit=" + diagramId);
	});

	/**
	 * Import from Excel
	 * Save Properties-Columns mapping in the db
	 * get the mapping from db
	 */

	app.get("/getMemoryFromDb", async function (req, res) {
		const listOfSheets = new Array();

		try {
			const sheetsInDb = await SheetSchema.find({}, function (err, data) {});

			const skeleton = {
				name: "",
				appName: "",
				appKey: "",
				appDescription: "",
				appCOTS: "",
				appReleaseDate: "",
				appShutdownDate: "",
			};
		} catch (error) {}

		for (const obj of sheetsInDb) {
			const tmp = new Object();
			Object.keys(skeleton).forEach((key) => {
				tmp[key] = obj[key];
			});
			listOfSheets.push(tmp);
		}

		console.log(listOfSheets);

		const data = new Object();

		data["listOfSheets"] = listOfSheets;

		res.send({
			status: "ok",
			data: data,
		});
	});

	app.post("/saveMemoryInDb", function (req, res) {
		const listOfSheets = req.body.listOfSheets;

		SheetSchema.deleteMany({}, function (err) {
			if (err) console.log(err);
		});

		if (listOfSheets.length > 0) {
			for (var i = 0; i < listOfSheets.length; i++) {
				console.log(listOfSheets[i]);
				const sheetInDb = new SheetSchema(listOfSheets[i]);

				sheetInDb.save();
				console.log("DataObj has been updated");
			}
		}
	});

	const excelReader = require("./routes/importAppsFromExcel");
	app.use("/importAppsFromExcel", excelReader);

	let server = app.listen(3000, function () {
		console.log("Express server listening on port " + server.address().port);
	});
	module.exports = app;
})();
