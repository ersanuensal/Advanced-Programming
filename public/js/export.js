// Function save and save2 are for export functions

// save is to create an list off all DataObj and give the data to the downnload funtion for export to CSV
function save() {

  var str = "";
  var pe = false;
  var dataObjListExport = presetList;


  // console.log("Hier kommt die CSV");

  str += "\"name\",\"description\",\"personalData\"\n";
  console.log(dataObjListExport);

  for (var i = 0; i < dataObjListExport.length; i++) {
    str += "\"" + dataObjListExport[i].Name + "\"" + ",";
    str += "\"" + dataObjListExport[i].Description + "\"" + ",";
    str += "\"" + dataObjListExport[i].PersonalData + "\"" + ",";

    str += "\n";
  }

  var filename = "";

  filename += getTodayTime().split(".")[0] + "_" + "DataObj.csv";

  download(str, filename);
  console.log(str);

}

function save2() {

  var dataObjPersoDataExportInstance = instanceOfPresetList;
  var dataObjPersoDataPresetlist = presetList;
  var dataObjPersoDataApplication = nodeList;
  var str = "";
  var pe = true;

  // console.log("Hier kommt die CSV");
  str += "\"Data Obj\", \"From Application\", \"To Application\"\n",
  // console.log(dataObjPersoDataExportInstance);
  // console.log(dataObjPersoDataPresetlist);
  // console.log(dataObjPersoDataApplication);

  dataObjPersoDataExportInstance.forEach((instanceElem) => {

    dataObjPersoDataPresetlist.forEach((presetElem) => {

      if (presetElem.PersonalData == true) {
        if (instanceElem.presetID == presetElem._id) {

          str += "\"" + presetElem.Name + "\"" + ",";

        }

        dataObjPersoDataApplication.forEach((appFromElem) => {

          if (instanceElem.linkFrom == appFromElem.key && instanceElem.presetID == presetElem._id) {
            str += "\"" + appFromElem.Name + "\"" + ",";
          }

        });

        dataObjPersoDataApplication.forEach((appToElem) => {

          if (instanceElem.linkTo == appToElem.key && instanceElem.presetID == presetElem._id) {
            str += "\"" + appToElem.Name + "\"" + ",";
            str += "\n";
          }

        });

      }

    });


  });

  //  console.log(str);
  var filename = "";

  filename += getTodayTime().split(".")[0] + "_" + "PersonalData.csv";

  download(str, filename);

}
