function init() {
  // short form for defining templates
  var $ = go.GraphObject.make;
  var myModel;
  var dagre = require("dagre");
  //  const today = new Date();
  today2 = getTodayTime().split('T')[0];

  nodeList = [];
  linkList = [];
  downloadedData = [];
  downloadedLinks = [];
  downloadedDataObj = [];
  presetList = downloadedDataObj;
  loadcheck = false;
  loadname = null;
  diagramId = document.getElementById('diagramId').value
  reuseselected = null;



  //  console.log(today2);


  myDiagram =
    $(go.Diagram, "myDiagramDiv", // create Diagramm in HTML
      {
        // create new node with doube click
        "clickCreatingTool.archetypeNodeData": {
          Name: "Application",
          Version: "",
          Description: "",
          COTS: "Undefined",
          Release: "",
          Shutdown: "",
          color: "blue",
          figure: "Subroutine",
          dateToday: ""
        },
        // function redo and undo
        "undoManager.isEnabled": true
      }
    );

  // Defining a standard template for the nodes
  myDiagram.nodeTemplate =
    $(go.Node, "Auto", {
      locationSpot: go.Spot.Center,
    },
      new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "Subroutine", {
        width: 200,
        height: 100,
        margin: 4,
        fill: "#29292a",
        stroke: "gray",
        strokeWidth: 3.5,
        portId: "",
        fromLinkable: true,
        toLinkable: true,
        fromLinkableDuplicates: false,
        toLinkableDuplicates: false, //disabling dublicate Link from Node A to Node B
        fromLinkableSelfNode: false,
        toLinkableSelfNode: false //disabling links from a node to it self
      },
        new go.Binding("stroke", "color").makeTwoWay(),
        new go.Binding("figure")),
      //    new go.Binding("fill", "color")),
      $(go.TextBlock, {
        margin: new go.Margin(5, 5, 3, 5),
        font: "bold 16pt sans-serif",
        stroke: 'ghostwhite',
        minSize: new go.Size(32, 32),
        maxSize: new go.Size(120, NaN),
        textAlign: "center",
        editable: true,
        verticalAlignment: go.Spot.Center,
        margin: 10
      },
        new go.Binding("text", "Name").makeTwoWay(),

      )


    );

  function loadDataFromDB() {
    if (document.getElementById('downloadData').value != "") {
      nodeArrayfromDB = JSON.parse(document.getElementById('downloadData').value)
      for (var i = 0; i < nodeArrayfromDB.length; i++) {
        downloadedData.push(nodeArrayfromDB[i]);
      }
      linkArrayfromDB = JSON.parse(document.getElementById('downloadLinks').value)
      for (var i = 0; i < linkArrayfromDB.length; i++) {
        downloadedLinks.push(linkArrayfromDB[i]);
      }
      dataObjArrayfromDB = JSON.parse(document.getElementById('downloadDataObj').value)
      for (var i = 0; i < dataObjArrayfromDB.length; i++) {
        downloadedDataObj.push(dataObjArrayfromDB[i]);
      }

      myDiagram.model = new go.GraphLinksModel(downloadedData, downloadedLinks);


    }
  }

  function loadDataObjFromDB() {
    dataObjArrayfromDB = JSON.parse(document.getElementById('downloadDataObj').value)
    for (var i = 0; i < dataObjArrayfromDB.length; i++) {
      downloadedDataObj.push(dataObjArrayfromDB[i]);
    }
  }
  loadDataFromDB();




  // The link shape and arrowhead have their stroke brush data bound to the "color" property
  myDiagram.linkTemplate =
    $(go.Link, {
      toShortLength: 8, // avoid interfering with arrowhead or ovverreiding the arrowhead,
      curve: go.Link.Bezier,
      //routing: go.Link.AvoidsNodes,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      /**
       * Handling mouse events (mouseover the Link)
       */
      // a mouseover highlights the link by changing the first main path shape's stroke:
      mouseEnter: function (e, link) {
        link.elt(0).stroke = "rgba(152, 193, 217, 0.8)";
      },
      mouseLeave: function (e, link) {
        link.elt(0).stroke = "transparent";
      }
    },
      new go.Binding("stroke", "Color"),
      // Link shape

      $(go.Shape, { // thick undrawn path make it easier the click the link
        isPanelMain: true,
        stroke: "transparent",
        strokeWidth: 8,
        toShortLength: 8
      }),

      $(go.Shape, { // the real drawn path default
        isPanelMain: true,
        strokeWidth: 4
      },
        new go.Binding("stroke", "Color").makeTwoWay()
      ),

      // Link arrowhead

      $(go.Shape, { // make the arrowhead more visibile and clear by scaling it
        toArrow: "Standard",
        scale: 1.5
      },
        new go.Binding("stroke", "Color").makeTwoWay(),
        new go.Binding("fill", "Color").makeTwoWay(),
      ),
      $(go.TextBlock, {
        segmentOffset: new go.Point(0, -10),
        segmentOrientation: go.Link.OrientUpright,
            font: "bold 16px sans-serif"
          },
          new go.Binding("text", "Name"))
      // Link Label
      /*
      link label is not just a simple text, it#s a node like object
      */

      // $(go.Panel, "Auto", // this whole Panel is a link label
      //   $(go.Shape, "RoundedRectangle", {
      //     fill: 'white',
      //     stroke: "#eeeeee",
      //     strokeWidth: 3
      //   })
        // $(go.Panel, "Table", {
        //   margin: 8,
        //   stretch: go.GraphObject.Fill
        // },
        //   $(go.TextBlock, {
        //     row: 0,
        //     alignment: go.Spot.Center,
        //     margin: new go.Margin(3, 24, 3, 2), // leave room for Button
        //     font: "bold 16px sans-serif"
        //   },
        //     new go.Binding("text", "Name")
        //   )
          // $("PanelExpanderButton", "HIDEN", // the name of the element whose visibility this button toggles
          //   {
          //     row: 0,
          //     alignment: go.Spot.TopRight
          //   }
          // ),
          // $(go.RowColumnDefinition, {
          //   row: 1,
          //   separatorStrokeWidth: 1.5,
          //   separatorStroke: "#eeeeee"
          // }),
          // $(go.Panel, "Table", {
          //   name: "HIDEN",
          //   width: 150,
          //   row: 1
          // },
          //   $(go.RowColumnDefinition, {
          //     row: 1,
          //     separatorStrokeWidth: 1.5,
          //     separatorStroke: "#eeeeee"
          //   }),
          //   $(go.TextBlock, {
          //     row: 0,
          //     alignment: go.Spot.Left,
          //     font: "bold 13px sans-serif",
          //     wrap: go.TextBlock.WrapFit,
          //     width: 150,
          //     textAlign: "left",
          //   },
          //     new go.Binding("text", "Description"),
          //   ),
          //
          //   /**personal Data: true or false*/
          //   $(go.TextBlock, {
          //     row: 1,
          //     alignment: go.Spot.Left,
          //     margin: new go.Margin(3, 2, 3, 2),
          //     font: "bold 13px sans-serif",
          //     text: "Personal Data: "
          //   }),
          //   $(go.TextBlock, {
          //     row: 1,
          //     alignment: go.Spot.Right,
          //     margin: new go.Margin(3, 2, 3, 2),
          //     font: "bold 13px sans-serif",
          //   },
          //     new go.Binding("text", "PersonalData")
          //   ),
          // )


    );


  // initialize Overview
  myOverview =
    $(go.Overview, "myOverviewDiv", {
      observed: myDiagram,
      contentAlignment: go.Spot.Center
    });

  // initialize Palette
  myPalette =
    $(go.Palette, "myPaletteDiv", {
      nodeTemplate: myDiagram.nodeTemplate,
      contentAlignment: go.Spot.Center,
      layout: $(go.GridLayout, {
        wrappingColumn: 1,
        cellSize: new go.Size(2, 2)
      }),

    });

  // now add the initial contents of the Palette
  myPalette.model.nodeDataArray = [
    // { Name: "Square", color: "purple", figure: "Square" },
    // { Name: "Rectangle", color: "red", figure: "Rectangle" },
    {
      Name: "Application",
      Version: "",
      Description: "",
      COTS: "Undefined",
      Release: "",
      Shutdown: "",
      color: "blue",
      figure: "Subroutine",
      dateToday: "",
    },
    // { Name: "Triangle", color: "purple", figure: "Triangle" },
  ];





  var inspector = new Inspector('myInspectorDiv', myDiagram, {
    includesOwnProperties: false,
    properties: {
      // Application properties - properties window
      "Name": {
        show: Inspector.showIfNode
      },
      "Version": {
        show: Inspector.showIfNode
      },
      "Description": {
        show: Inspector.showIfNode,
        type: "field"
      },
      "COTS": {
        show: Inspector.showIfNode,
        type: "select",
        choices: function (node, propName) {
          if (Array.isArray(node.data.choices)) return node.data.choices;
          return ["COTS", "Proprietary", "Undefined"];
        }
      },
      "Release": {
        show: Inspector.showIfNode,
        type: "date"
      },
      "Shutdown": {
        show: Inspector.showIfNode,
        type: "date"
      },


    }
  }
  );



  // Eventlistener for hiding the Inspector and trafficlight system
  myDiagram.addDiagramListener("ChangedSelection", function (diagramEvent) {
    nodeList = [];
    linkList = [];
    let selectedPart = myDiagram.selection.first();



    if (selectedPart == null) {
      document.getElementById("myInspectorDiv").style.display = "none";
    } else {
      document.getElementById("myInspectorDiv").style.display = "initial";
    }


    myDiagram.commit(function (d) {
      d.links.each(function (link) {
        var linkObj = new Link(link.data.from, link.data.to, link.data.Name, link.data.Description, link.data.Color, link.data.PersonalData, link.data.LoadPreset, diagramId)
        linkList.push(linkObj);
        document.getElementById('uploadLinks').value = JSON.stringify(linkList);

        if (loadcheck && reuseselected != null && reuseselected instanceof go.Link) {

          if (reuseselected.data.from == link.data.from && reuseselected.data.to == link.data.to) {
            for (var i = 0; i < presetList.length; i++) {
              if (loadname == presetList[i].Name) {
                //link.data.Name = presetList[i].Name;
                myDiagram.model.setDataProperty(link.data, "Name", presetList[i].Name);
                myDiagram.model.setDataProperty(link.data, "Description", presetList[i].Description);
                myDiagram.model.setDataProperty(link.data, "Color", presetList[i].Color);
                myDiagram.model.setDataProperty(link.data, "PersonalData", presetList[i].PersonalData);
                loadcheck = false;
                reuseselected = null;
              }
            }
          }




        }

      });
      d.nodes.each(function (node) {
        if (node.data.Shutdown <= today2 && node.data.Shutdown >= "0000-00-00") {
          myDiagram.model.setDataProperty(node.data, "color", "red")
        } else if ((node.data.Release <= today2 && node.data.Shutdown > today2) || (node.data.Release <= today2 && node.data.Shutdown === "" && node.data.Release != "")) {
          myDiagram.model.setDataProperty(node.data, "color", "green")
        } else if (node.data.Release > today2) {
          myDiagram.model.setDataProperty(node.data, "color", "orange")
        } else {
          myDiagram.model.setDataProperty(node.data, "color", "blue")
        }

        if ((node.data.Shutdown < node.data.Release) && (node.data.Shutdown > "0000-00-00")) {
          node.data.Shutdown = "0000-00-00";
          myDiagram.model.setDataProperty(node.data, "color", "green")
        }


        var nodeObj = new Node(node.data.Name, node.data.Version, node.data.Description, node.data.COTS, node.data.Release, node.data.Shutdown, node.data.color, node.data.figure, node.data.key, node.data.location, diagramId)
        nodeList.push(nodeObj);
        document.getElementById('uploadData').value = JSON.stringify(nodeList);
        document.getElementById("uploadDataObj").value = JSON.stringify(downloadedDataObj);

      });



    });



    });

  myDiagram.addDiagramListener("ObjectSingleClicked",
    function (e) {

      var tz = true;
      reuseselected = e.subject.part;

      if (reuseselected instanceof go.Link) {

      }
    });

    myDiagram.addDiagramListener("ObjectContextClicked",
      function (e) {
        reuseselected = e.subject.part;

        if (reuseselected instanceof go.Link) {
          console.log("Clicked on Double " + reuseselected.data.from + " " + reuseselected.data.to);
          loadDataObjModal();

          // load link data to Modal
          myDiagram.commit(function (d) {
            d.links.each(function (link) {
              if (reuseselected.data.from == link.data.from && reuseselected.data.to == link.data.to) {
                    document.getElementById("linkFrom").value = link.data.from;
                    document.getElementById("linkTo").value = link.data.to;
                    document.getElementById("linkName").value = link.data.Name;
                    document.getElementById("linkDescription").value = link.data.Description;
                    document.getElementById("linkColor").value = link.data.Color;
                    document.getElementById("linkPersonalData").checked = link.data.PersonalData;
                console.log("loaded link")
              }
            });
        });

      }
      });

    function autolayout() {

        console.log(JSON.stringify(myModel));

        // Create a new dagre graph , note: this graph is only used for layout.
        var dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setGraph({
          rankdir: 'LR',
          nodesep: 100,
          ranksep: 20,
          edgesep: 20,
        });

        // Default to assigning a new object as a label for each new edge.
        dagreGraph.setDefaultEdgeLabel(function() { return {label: 'label'}; });

        for (n in nodes) {
          dagreGraph.setNode(n,{width: nodes[n].width, height: nodes[n].height})
        };

        links.forEach(function(link){
          dagreGraph.setEdge(link.from, link.to, {minlen: 2});
        });

        dagre.layout(dagreGraph);

        dagreGraph.nodes().forEach(function(v){
          var node = dagreGraph.node(v);
          console.log("Node " + v + ": " + JSON.stringify(node));
    //      myModel.nodeDataArray[n.id].loc = n.x+' '+n.y;
          nodes[v].x = node.x;
          nodes[v].y = node.y;

        });

    }

}



  // save link data to Modal
  function saveLinkProperties(node) {
    myDiagram.commit(function (d) {
      d.links.each(function (link) {
        if (link.data.from == document.getElementById("linkFrom").value && link.data.to == document.getElementById("linkTo").value) {
          myDiagram.model.setDataProperty(link.data, "Name", document.getElementById("linkName").value);
          myDiagram.model.setDataProperty(link.data, "Description", document.getElementById("linkDescription").value);
          myDiagram.model.setDataProperty(link.data, "Color", document.getElementById("linkColor").value);
          myDiagram.model.setDataProperty(link.data, "PersonalData", document.getElementById("linkPersonalData").checked);
          console.log("saved link")
        }
      });
    });


  }

function showData() {

  var json = myDiagram.model.toJson();

  console.log(json);

}


window.addEventListener('DOMContentLoaded', init);
