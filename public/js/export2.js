function save2() {


  var json = myDiagram.model.toJson();
  var str = "";

  //  console.log(json);
  //window.alert(myDiagram.model.toJson());

  console.log("Hier kommt die CSV");
  var obj = JSON.parse(json);
  //console.log(obj.nodeDataArray);

  str += "\"From Application\",\"Version\",\"Description\",\"COTS\",\"Release\",\"Shutdown\",\"To Application\",\"Version\",\"Description\",\"COTS\",\"Release\",\"Shutdown\"\n";
  console.log(obj.nodeDataArray);

  for (var i = 0; i < obj.linkDataArray.length; i++) {

    if (obj.linkDataArray[i].PersonalData == true) {

      for (var j = 0; j < obj.nodeDataArray.length; j++) {
        if (obj.linkDataArray[i].from == obj.nodeDataArray[j].key) {
          str += "\"" + obj.nodeDataArray[j].Name + "\"" + ",";
          str += "\"" + obj.nodeDataArray[j].Version + "\"" + ",";
          str += "\"" + obj.nodeDataArray[j].Description + "\"" + ",";
          str += "\"" + obj.nodeDataArray[j].COTS + "\"" + ",";
          str += "\"" + obj.nodeDataArray[j].Release + "\"" + ",";
          str += "\"" + obj.nodeDataArray[j].Shutodwn + "\"" + ",";
        }
      }


      for (var k = 0; k < obj.nodeDataArray.length; k++) {
        if (obj.linkDataArray[i].to == obj.nodeDataArray[k].key) {
          str += "\"" + obj.nodeDataArray[k].Name + "\"" + ",";
          str += "\"" + obj.nodeDataArray[k].Version + "\"" + ",";
          str += "\"" + obj.nodeDataArray[k].Description + "\"" + ",";
          str += "\"" + obj.nodeDataArray[k].COTS + "\"" + ",";
          str += "\"" + obj.nodeDataArray[k].Release + "\"" + ",";
          str += "\"" + obj.nodeDataArray[k].Shutodwn + "\"" + ",";
        }
      }


      str += "\n";
    }
  }

  //  console.log(str);

  var filename = "";
  const todaydate = new Date();

  var datetoday = todaydate.toLocaleDateString();

  console.log(datetoday);

  var res = datetoday.split(".");

  filename += res[2] + "-" + res[1] + "-" + res[0] + "-" + "PersonalData.csv";

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
