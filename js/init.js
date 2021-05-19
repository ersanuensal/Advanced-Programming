function init() {

  // short form for defining templates
  var $ = go.GraphObject.make;

  var myDiagram =
    $(go.Diagram, "myDiagramDiv", // create Diagramm in HTML
      {
        // create new node with doube click
        "clickCreatingTool.archetypeNodeData": {
          Name: "Application",
          color: "blue",
          figure: "RoundedRectangle"
        },
        // function redo and undo
        "undoManager.isEnabled": true
      });

  // Defining a standard template for the nodes
  myDiagram.nodeTemplate =
    $(go.Node, "Auto", {
        locationSpot: go.Spot.Center
      },
      new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "Circle", {
          fill: "#29292a",
          stroke: "gray",
          strokeWidth: 4,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          fromLinkableDuplicates: false,
          toLinkableDuplicates: false, //disabling dublicate Link from Node A to Node B
          fromLinkableSelfNode: false,
          toLinkableSelfNode: false //disabling links from a node to it self
        },
        new go.Binding("stroke", "color"),
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
        new go.Binding("text", "Name").makeTwoWay())
    );

  // The link shape and arrowhead have their stroke brush data bound to the "color" property
  myDiagram.linkTemplate =
    $(go.Link, {
        toShortLength: 8, // avoid interfering with arrowhead or ovverreiding the arrowhead,
        curve: go.Link.Bezier,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true
      },

      // Link shape

      $(go.Shape, { // thick undrawn path make it easier the click the link
        isPanelMain: true,
        stroke: "transparent",
        strokeWidth: 8,
        toShortLength: 8
      }),

      $(go.Shape, { // the real drwan path default
          isPanelMain: true,
          stroke: "blue",
          strokeWidth: 4
        },
        new go.Binding("stroke", "color")
      ),

      // Link arrowhead

      $(go.Shape, { // make the arrowhead more visibile and clear by scaling it
          toArrow: "Standard",
          scale: 1.5,
          stroke: "blue",
          fill: "blue"
        },
        new go.Binding("stroke", "color"),
        new go.Binding("fill", "color")
      ),

      // Link Label

      $(go.TextBlock, {
          text: 'Label',
          editable: true,
          textAlign: 'center',
          font: 'bold 16px Arial Rounded MT',
          stroke: "blue",
          segmentOffset: new go.Point(0, -10),
          segmentOrientation: go.Link.OrientUpright,
        },
        new go.Binding("stroke", "color")
      ),

      /**
       * Handling mouse events (mouseover the Link)
       */
      {
        // a mouseover highlights the link by changing the first main path shape's stroke:
        mouseEnter: function(e, link) {
          link.elt(0).stroke = "rgba(152, 193, 217, 0.8)";
        },
        mouseLeave: function(e, link) {
          link.elt(0).stroke = "transparent";
        }
      }
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
      color: "blue",
      figure: "RoundedRectangle"
    },
    // { Name: "Triangle", color: "purple", figure: "Triangle" },
  ];

  var inspector = new Inspector('myInspectorDiv', myDiagram, {
    includesOwnProperties: false,
    properties: {
      // Application properties - properties window
      "Name": {},
      "Version": {},
      "Description": { show: Inspector.showIfNode},
      "COTS": {},
      "Release date": {},
      "Shutdown date": {},
      "color": {
        type: 'color'
      },
    }
  });
// This function is for to show or hide the inspector
  myDiagram.addDiagramListener("ChangedSelection", function(diagramEvent) {
    var sh = myDiagram.selection.first();
    if (sh == null) {
      document.getElementById("myInspectorDiv").style.display = "none";
    } else if (sh != null) {
      document.getElementById("myInspectorDiv").style.display = "initial";
    }
  });


}

window.addEventListener('DOMContentLoaded', init);
