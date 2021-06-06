function download(str, pe) {

  var filename = "";
  const todaydate = new Date();

  var datetoday = todaydate.toLocaleDateString();

  console.log(datetoday);

  var res = datetoday.split(".");

  if (pe == false) {
    filename += res[2] + "-" + res[1] + "-" + res[0] + "-" + "DataObj.csv";
  } else if (pe == true) {
    filename += res[2] + "-" + res[1] + "-" + res[0] + "-" + "PersonalData.csv";
  }

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
