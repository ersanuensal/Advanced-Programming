window.onload = function() {

  document.getElementById("asd").style.display = "none";
  document.getElementById("asdf").style.display = "none";
};


function asd(a) {

  if (a == 1) {
    document.getElementById("asd").style.display = "block";
  } else {
    document.getElementById("asd").style.display = "none";
  }

}

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

      var presetObj = new Preset(dataObjName, dataObjDes, dataObjColor, dataObjPer, dataObjTime);
      presetList.push(presetObj);
      document.getElementById("dataObjName").value = "";
      document.getElementById("dataObjDes").value = "";
      document.getElementById("dataObjColor").value = "#000000";
      document.getElementById("dataObjPer").checked = false;
      asd(0);
    }


    test();
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

  var myModal = new bootstrap.Modal(document.getElementById('dataObjModal'), {
  keyboard: false
  })
  myModal.show()
}
