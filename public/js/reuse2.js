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

// testfunktion zum debuggen
// function saveLinkProperties() {
//     reuseselected = e.subject.part;
//     console.log(reuseselected.data.from)
// }

function resave() {

  var check = true;
  var dataObjName = document.getElementById("dataObjName").value;
  var dataObjDes = document.getElementById("dataObjDes").value;
  var dataObjColor = document.getElementById("dataObjColor").value;
  var dataObjPer = document.getElementById("dataObjPer").checked;
  var dataObjTime = getTodayTime().split(".")[0];

  console.log(dataObjPer);

  if (dataObjName == "" || dataObjDes == "") {
    console.log("Value ist leer");
  } else {

    if (!presetList.length) {
      console.log("Not");
    } else {

      for (var i = 0; i < presetList.length; i++) {
        if (presetList[i].Name == dataObjName) {
          console.log("Bereits vorhanden");
          check = false;
          break;
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
    }
    // input#diagramId(type='hidden', name='diagramId' value=diagramId)
    // input#uploadData(type='hidden', name='uploadData')
    // input#uploadLinks(type='hidden', name='uploadLinks')
    // input#uploadDataObj(type='hidden', name="uploadDataObj")
    document.getElementById("uploadDataObj").value = JSON.stringify(presetList);
    document.getElementById('uploadDBForm').submit();
    // test();
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

function showEditDataObj(a) {

  if (a == 1) {
    document.getElementById("showEditDataObj").style.display = "block";
    document.getElementById("selectDataObj").style.display = "block";
    document.getElementById("showEditDataObjForm").style.display = "block";
    document.getElementById("showCreateDataObj").style.display = "none";
    document.getElementById("editTab").setAttribute("aria-selected", "true");
    document.getElementById("createTab").removeAttribute("aria-selected", "false");

    createTableForEdit();
  } else {
    document.getElementById("showEditDataObj").style.display = "none";
  }

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
  var array = downloadedDataObj;
  var selectLength = mySelect.options.length;
  for (i = selectLength-1; i  >= 0; i--) {
      mySelect.options[i] = null;
  }

  var initialOpt = document.createElement('option')
  initialOpt.innerHTML = "Select a Data Object"
  mySelect.appendChild(initialOpt);
  //Create and append the options
  for (var i = 0; i < array.length; i++) {
    var opt = document.createElement('option');
    opt.value = array[i]._id;
    opt.innerHTML = array[i].Name;
    mySelect.appendChild(opt);
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

  var selectedDataObj = element.options[element.selectedIndex].value;

  console.log(selectedDataObj);

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

  for (var i = 0; i < presetList.length; i++) {
    if (presetList[i]._id == dataObjID) {
      presetList[i].Name = document.getElementById("dataObjNameEdit").value;
      presetList[i].Description = document.getElementById("dataObjDesEdit").value;
      presetList[i].Color = document.getElementById("dataObjColorEdit").value;
      presetList[i].PersonalData = document.getElementById("dataObjPerEdit").checked;
    }
  }
  // document.getElementById("uploadDataObj2").value = JSON.stringify(presetList);
  // document.getElementById('updateDataObjForm').submit();
  document.getElementById("uploadDataObj").value = JSON.stringify(presetList);
  document.getElementById('uploadDBForm').submit();
  // createTableForEdit();
}
