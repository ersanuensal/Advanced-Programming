// opens diagram that is selected
function showSelectedItem() {
  var element = document.getElementById("selectDiagram");
  try {
    var selectedDiagram = element.options[element.selectedIndex].value;
    console.log("The selected Diagram is " + selectedDiagram);
    window.location.replace("http://localhost:3000/edit=" + selectedDiagram);
  } catch (e) {
    selectMsg.style.display = 'flex';
  }

}

// enables the button if item from list is selected 
function enableButton()
{
    var selectelem = document.getElementById('selectDiagram');
    var btnelemDelete = document.getElementById('deleteBtn');
    var btnelemOpen = document.getElementById('openBtn');
    
    btnelemDelete.style.backgroundColor = "red";
    btnelemDelete.disabled = !selectelem.value;

    btnelemOpen.disabled = !selectelem.value;
}


// deletes selected diagram if triggered
function deleteDiagram() {
  var element = document.getElementById("selectDiagram");
  var selectedDiagram = element.options[element.selectedIndex].value;
  console.log("The selected Diagram is " + selectedDiagram);

  window.location.replace("http://localhost:3000/delete=" + selectedDiagram);
}


// 
var mySelect = document.getElementById("selectDiagram");

//Create array of options to be added
var array = JSON.parse(document.getElementById("diagramsList").value);


//Create and append the options
for (var i = 0; i < array.length; i++) {
  var opt = document.createElement('option');
  opt.value = array[i]._id;
  opt.innerHTML = array[i].name;
  mySelect.appendChild(opt);
}

// creates new diagram if triggered
function createDiagram() {

  var diagramName = document.getElementById("diagramName").value;
  const errorMsg = document.getElementById('errorMsg');
  if (diagramName == '') {
    errorMsg.innerHTML = 'A name is required to create a Diagram';
    document.getElementById("diagramName").focus();
  } else {
    console.log(diagramName + " created.");
    window.location.replace("http://localhost:3000/new=" + diagramName);
  }

}
