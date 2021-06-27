window.onload = function() {

  document.getElementById("showCreateDataObj").style.display = "none";
  document.getElementById("showEditDataObj").style.display = "none";
  //document.getElementById("showEditDataObjForm").style.display = "none";

};


function showCreateDataObj(a) {

  if (a == 1) {
    document.getElementById("showCreateDataObj").style.display = "block";
    document.getElementById("showEditDataObj").style.display = "none";
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
        x.remove(x.length-1);
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

function showEditDataObj(a) {

  if (a == 1) {
    document.getElementById("showEditDataObj").style.display = "block";
    document.getElementById("selectDataObj").style.display = "block";
    document.getElementById("showCreateDataObj").style.display = "none";

    // diagramId = document.getElementById('diagramId').value
    // var url = "http://localhost:3000/dataobjs/" + diagramId;
    // var getNewList;
    // fetch(url).then(res => res.json()).then(data => getNewList = data).then(() => console.log(getNewList));
    // loadDataObjFromDB();
    createTableForEdit();
  } else {
    document.getElementById("showEditDataObj").style.display = "none";
  }

}

function createTableForEdit () {
  var mySelect = document.getElementById("selectDataObj");
  console.log(downloadedDataObj);
  //Create array of options to be added
  var array = downloadedDataObj;

  for (var i = 0; i < array.length; i++) {
    if (mySelect.length > 0) {
      mySelect.remove(mySelect.length-1);
    }
  }


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

function SaveEditedDataObj(){
  var dataObjID = document.getElementById("hiddenDataObjID").value;

  for (var i = 0; i < presetList.length; i++) {
    if (presetList[i]._id == dataObjID) {
      presetList[i].Name = document.getElementById("dataObjNameEdit").value;
      presetList[i].Description = document.getElementById("dataObjDesEdit").value;
      presetList[i].Color = document.getElementById("dataObjColorEdit").value;
      presetList[i].PersonalData = document.getElementById("dataObjPerEdit").checked;
    }
  }
  document.getElementById("uploadDataObj").value = JSON.stringify(presetList);
  document.getElementById('uploadDBForm').submit();
  // createTableForEdit();
}
