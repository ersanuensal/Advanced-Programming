window.onload = function() {

  // document.getElementById("showCreateDataObj").style.display = "block";
  // document.getElementById("showEditDataObj").style.display = "none";
  // document.getElementById("showEditDataObjForm").style.display = "none";

};


function showCreateDataObj(a) {

  if (a == 1) {
    document.getElementById("showCreateDataObj").style.display = "block";
    document.getElementById("showEditDataObj").style.display = "none";
    document.getElementById("showEditDataObjForm").style.display = "none";
  } else {
    document.getElementById("showCreateDataObj").style.display = "none";

  }

}


function resave() {

  var check = true;
  var dataObjName = document.getElementById("dataObjName").value;
  var dataObjDes = document.getElementById("dataObjDes").value;
  var dataObjColor = document.getElementById("dataObjColor").value;
  var dataObjPer = document.getElementById("dataObjPer").checked;
  var dataObjTime = getTodayTime().split(".")[0];
  var validDataObjectCreate = document.getElementById("validDataObjectCreate");
  var validDataObjectExist = document.getElementById("validDataObjectExist");
  var validDataObjectEditDelete = document.getElementById("validDataObjectEditDelete");

  console.log(dataObjPer);

  if (dataObjName == "") {
    console.log("Data Object Name is empty!");
    validDataObjectExist.style.display = 'none';
    validDataObjectEditDelete.style.display = 'none';
    validDataObjectCreate.innerHTML = "<i class='fa fa-warning', style='position:relative;float:left;padding:6px 2px;'></i><span aria-hidden='true'> &nbsp;Please enter an Name for the Data Object </span>"
    validDataObjectCreate.style.display = 'flex';
  } else {

    if (!presetList.length) {
      console.log("Not");
    } else {

      for (var i = 0; i < presetList.length; i++) {
        if (presetList[i].Name == dataObjName) {
          validDataObjectCreate.style.display = 'none';
          validDataObjectEditDelete.style.display = 'none';
          console.log("Data Object exist already!");
          validDataObjectCreate.innerHTML = "<i class='fa fa-warning', style='position:relative;float:left;padding:6px 2px;'></i><span aria-hidden='true'> &nbsp;Data Object exist already! </span>"
          validDataObjectCreate.style.display = 'flex';
          check = false;
          // break;
        }
      }


    }

    if (check == true) {

      var presetObj = new Preset(dataObjName, dataObjDes, dataObjColor, dataObjPer, dataObjTime, diagramId);
      presetList.push(presetObj);
      document.getElementById("dataObjName").value = "";
      document.getElementById("dataObjDes").value = "";
      document.getElementById("dataObjColor").value = "#000000";
      document.getElementById("dataObjPer").checked = false;
      showCreateDataObj(0);
      validDataObjectCreate.style.display = 'none';
      validDataObjectExist.style.display = 'none';
      validDataObjectEditDelete.style.display = 'none';

      document.getElementById("uploadDataObj").value = JSON.stringify(presetList);
      document.getElementById('uploadDBForm').submit();
    }

  }
}


function test() {
  for (var i = 0; i < presetList.length; i++) {
    console.log(presetList[i].Name);
  }
}

function asdf(a) {

  if (a == 1) {
    document.getElementById("asdf").style.display = "block";
    var select = document.getElementById("selectNumber");

    for (var i = 0; i < presetList.length; i++) {
      if (!presetList.length) {

      } else {

        var opt = presetList[i].Name;
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }


    }
  } else {
    document.getElementById("asdf").style.display = "none";

    var x = document.getElementById("selectNumber");
    for (var i = 0; i < x.length; i++) {
      if (x.length > 1) {
        x.remove(x.length - 1);
      }
    }


    document.getElementById("selectNumber").value = "";



  }

}

function reload() {

  var e = document.getElementById("selectNumber");
  loadname = e.value;

  console.log(loadname);

  loadcheck = true;
  asdf(0);
}

function loadDataObjModal() {

  var myModal = new bootstrap.Modal(document.getElementById('linkInspector'), {
    keyboard: false
  })
  myModal.show()
}

function loadNodeModal() {

  var myModal = new bootstrap.Modal(document.getElementById('nodeInspector'), {
    keyboard: false
  })
  myModal.show()
}

function showEditDataObj() {
  var myModal = new bootstrap.Modal(document.getElementById('editDataObject'), {
    keyboard: false
  })
  myModal.show()
  createTableForEdit();


}

function createTableForEdit() {
  var mySelect = document.getElementById("selectDataObj");
  console.log(presetList);
  //Create array of options to be added
  var array = presetList;

  mySelect.options.length = 0;

  //Create and append the options
  for (var i = 0; i < array.length; i++) {
    var opt = document.createElement('option');
    opt.value = array[i]._id;
    opt.innerHTML = array[i].Name;
    mySelect.appendChild(opt);
  }

}

function createTableForAddDataObj() {
  var mySelect = document.getElementById("addDataObjectSelect");
  var from = document.getElementById("linkFrom").value;
  var to = document.getElementById("linkTo").value;
  // var array = downloadedDataObj;
  var array = presetList;
  var selectLength = mySelect.options.length;
  for (i = selectLength-1; i  >= 0; i--) {
      mySelect.options[i] = null;
  }

  var initialOpt = document.createElement('option')
  initialOpt.innerHTML = "Select a Data Object"
  mySelect.appendChild(initialOpt);
  //Create and append the options
  for (var i = 0; i < array.length; i++) {
      var checkOption = false;
      instanceOfPresetList.forEach((elem) => {
          if (elem.presetID == array[i]._id && elem.linkFrom == from && elem.linkTo == to) {
              console.log("ignoring option")
              checkOption = true;
          }
      });
      if (checkOption == false) {
          var opt = document.createElement('option');
          opt.value = array[i]._id;
          opt.innerHTML = array[i].Name;
          mySelect.appendChild(opt);
      }

  }



}

function selectDataObjFromTable() {
  var element = document.getElementById("selectDataObj");
  console.log(element);
  var selectedDataObj = element.options[element.selectedIndex].value;

  console.log(selectedDataObj);
  // document.getElementById("selectDataObj").style.display = "none";
  document.getElementById("showEditDataObjForm").style.display = "block";

  for (var i = 0; i < presetList.length; i++) {
    if (presetList[i]._id == selectedDataObj) {

        document.getElementById("hiddenDataObjID").value = selectedDataObj;
        document.getElementById("dataObjNameEdit").value = presetList[i].Name;
        document.getElementById("dataObjDesEdit").value = presetList[i].Description;
        document.getElementById("dataObjColorEdit").value = presetList[i].Color;
        document.getElementById("dataObjPerEdit").checked = presetList[i].PersonalData;
    }
  }
}

// For deleting a Data Object completly
function deleteDataObjFromTable() {
  var element = document.getElementById("selectDataObj");
  var validDataObjectEditEmpty = document.getElementById("validDataObjectEditEmpty");
  var validDataObjectEditExist = document.getElementById("validDataObjectEditExist");
  var validDataObjectEditDelete = document.getElementById("validDataObjectEditDelete");

  try {
    var selectedDataObj = element.options[element.selectedIndex].value;
  } catch (e) {
    validDataObjectEditDelete.innerHTML = "<i class='fa fa-warning', style='position:relative;float:left;padding:6px 2px;'></i><span aria-hidden='true'> &nbsp;No data object selected </span>"
    validDataObjectEditDelete.style.display = 'flex';
  }


  // console.log(selectedDataObj);
  if (selectedDataObj == null) {
    console.log("None selected!");
  } else {
    validDataObjectEditDelete.style.display = 'none';
    instanceOfPresetList.forEach((item, i) => {
        if (item.presetID == selectedDataObj) {
          instanceOfPresetList.splice(i, 1);
        }
    });
    presetList.forEach((item, i) =>{
        if(item._id == selectedDataObj){
            presetList.splice(i, 1);
        }
    })

    // Just for triggering rename with ChangedEvent
    myDiagram.commit(function(d) {
      d.links.each(function(link) {
        var renaming = "updating ..."
        myDiagram.model.setDataProperty(link.data, "Name", renaming);
      });
    });

    createTableForEdit()
  }

}

function selectDataObjFromAddTable() {
  var element = document.getElementById("addDataObjectSelect");
  var selectedDataObj = element.options[element.selectedIndex].value;
  var instanceFrom = document.getElementById("linkFrom").value;
  var instanceTo = document.getElementById("linkTo").value;
  var checkInstanceDouble = false

  var instanceId;
  for (var i = 0; i < presetList.length; i++) {
    if (presetList[i]._id == selectedDataObj) {
      instanceId = presetList[i]._id;
    }
  }

  instanceOfPresetList.forEach((item) => {
      if (item.presetID == instanceId && item.linkFrom == instanceFrom && item.linkTo == instanceTo) {
          checkInstanceDouble = true;
      }
  });

  if (selectedDataObj == "Select a Data Object") {
      console.log("Please select a Valid Data Object");
      console.log("\"" + selectedDataObj + "\" is not a Option to add");
      validDataObject.innerHTML = "<i class='fa fa-warning', style='position:relative;float:left;padding:6px 2px;'></i><span aria-hidden='true'> &nbsp;Please select a valid Data Object </span>"
      validDataObject.style.display = 'flex';
  } else if (checkInstanceDouble){
      validDataObject.innerHTML = "<i class='fa fa-warning', style='position:relative;float:left;padding:6px 2px;'></i><span aria-hidden='true'> &nbsp;This Data Object is already part of this Link </span>"
      validDataObject.style.display = 'flex';
  } else {
      var instance = new InstanceOfPreset(instanceFrom, instanceTo, instanceId, diagramId);
      instanceOfPresetList.push(instance);
      saveLinkProperties();
      var from = document.getElementById("linkFrom").value;
      var to = document.getElementById("linkTo").value;
      createTableForLinks(from, to);
      saveLinkProperties();
  }
}

function SaveEditedDataObj() {
  var dataObjID = document.getElementById("hiddenDataObjID").value;
  var validDataObjectEditEmpty = document.getElementById("validDataObjectEditEmpty");
  var validDataObjectEditExist = document.getElementById("validDataObjectEditExist");
  var validDataObjectEditDelete = document.getElementById("validDataObjectEditDelete");
  var checkName = true;
  console.log(presetList);

  if (document.getElementById("dataObjNameEdit").value == "") {
    console.log("Data Object Name is empty!");
    validDataObjectEditExist.style.display = 'none';
    validDataObjectEditDelete.style.display = 'none';
    validDataObjectEditEmpty.innerHTML = "<i class='fa fa-warning', style='position:relative;float:left;padding:6px 2px;'></i><span aria-hidden='true'> &nbsp;Data Object Name can not be empty! </span>"
    validDataObjectEditEmpty.style.display = 'flex';
    checkName = false;
  }
  for (var i = 0; i < presetList.length; i++) {
    if (presetList[i].Name == document.getElementById("dataObjNameEdit").value) {
      console.log("Data Object Name exists already!");
      console.log(presetList[i].Name);
      validDataObjectEditEmpty.style.display = 'none';
      validDataObjectEditDelete.style.display = 'none';
      validDataObjectEditExist.innerHTML = "<i class='fa fa-warning', style='position:relative;float:left;padding:6px 2px;'></i><span aria-hidden='true'> &nbsp;Data Object Name already exist! </span>"
      validDataObjectEditExist.style.display = 'flex';
      checkName = false;
    }

  }



  if (checkName == true) {

    presetList.forEach((item) => {

      if (item._id == dataObjID) {

          //console.log(presetList);
          item.Name = document.getElementById("dataObjNameEdit").value;
          item.Description = document.getElementById("dataObjDesEdit").value;
          item.Color = document.getElementById("dataObjColorEdit").value;
          item.PersonalData = document.getElementById("dataObjPerEdit").checked;
          validDataObjectEditEmpty.style.display = 'none';
          validDataObjectEditExist.style.display = 'none';
          validDataObjectEditDelete.style.display = 'none';
          document.getElementById("uploadDataObj").value = JSON.stringify(presetList);
          document.getElementById('uploadDBForm').submit();
          //checkName = true;
      }

    });



    checkName = true;
  }

}
