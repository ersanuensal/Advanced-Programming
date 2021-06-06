function save() {

  var json = myDiagram.model.toJson();
  var str = "";

  //  console.log(json);
  //window.alert(myDiagram.model.toJson());

  console.log("Hier kommt die CSV");
  var obj = JSON.parse(json);
  //console.log(obj.nodeDataArray);

  str += "\"name\",\"description\",\"personalData\",\"from\",\"to\"\n";
  console.log(obj.linkDataArray);

  for (var i = 0; i < obj.linkDataArray.length; i++) {
    str += "\"" + obj.linkDataArray[i].Name + "\"" + ",";
    str += "\"" + obj.linkDataArray[i].Description + "\"" + ",";
    str += "\"" + obj.linkDataArray[i].PersonalData + "\"" + ",";

    for (var j = 0; j < obj.nodeDataArray.length; j++) {
      if (obj.linkDataArray[i].from == obj.nodeDataArray[j].key) {
        str += "\"" + obj.nodeDataArray[j].Name + "\"" + ",";
      }

    }

    for (var k = 0; k < obj.nodeDataArray.length; k++) {
      if (obj.linkDataArray[i].to == obj.nodeDataArray[k].key) {
        str += "\"" + obj.nodeDataArray[k].Name + "\"";
      }

    }


    str += "\n";
  }


  //  console.log(str);

  var filename = "";
  const todaydate = new Date();

  var datetoday = todaydate.toLocaleDateString();

  console.log(datetoday);

  var res = datetoday.split(".");

  filename += res[2] + "-" + res[1] + "-" + res[0] + "-" + "export.csv";

  var blob = new Blob([str], {
    type: 'text/csv;charset=utf-8;'
  });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

}




/*
{ "class": "GraphLinksModel",
  "nodeDataArray": [
{"Name":"A","color":"#0000ff","figure":"Subroutine","dateToday":"27.5.2021","key":-1,"location":"-639.5 -269.5","Version":"1","Description":"A","Release date":"2111-11-11","Shutdown date":"2121-11-11","State":"COTS"},
{"Name":"B","color":"#0000ff","figure":"Subroutine","dateToday":"27.5.2021","key":-2,"location":"-165 -279","Version":"2","Description":"V","Release date":"2222-02-22","Shutdown date":"3333-03-22","State":"Propietary"}
],
  "linkDataArray": [{"from":-1,"to":-2,"Name":"c","Description":"c","color":"#000000","personal data?":true}]}


*/
