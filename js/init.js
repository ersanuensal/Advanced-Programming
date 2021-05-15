function init() {

  // short form for defining templates
  var $ = go.GraphObject.make;

  var myDiagram =
    $(go.Diagram, "myDiagramDiv", // create Diagramm in HTML
      {
        // create new node with doube click
        "clickCreatingTool.archetypeNodeData": { text: "Node", color: "white" },
        // function redo and undo
        "undoManager.isEnabled": true
      });

  // Defining a standard template for the nodes
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      { locationSpot: go.Spot.Center },
      new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "Circle",
        {
          fill: "white", stroke: "gray", strokeWidth: 2,
          portId: "", fromLinkable: true, toLinkable: true,
          fromLinkableDuplicates: false, toLinkableDuplicates: false, //disabling dublicate Link from Node A to Node B
          fromLinkableSelfNode: false, toLinkableSelfNode: false //disabling links from a node to it self
        },
        new go.Binding("stroke", "color"),
        new go.Binding("figure")),
      //    new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: new go.Margin(5, 5, 3, 5), font: "bold 16pt sans-serif",
          minSize: new go.Size(32, 32), maxSize: new go.Size(120, NaN),
          textAlign: "center", editable: true, verticalAlignment: go.Spot.Center, margin: 10
        },
        new go.Binding("text").makeTwoWay())
    );

  // The link shape and arrowhead have their stroke brush data bound to the "color" property
  myDiagram.linkTemplate =
    $(go.Link,
      {
        // routing: go.Link.AvoidsNodes,// link is going to try its best to avoid crossing other nodes
        // on its way from Node A to Node B

        // curve: go.Link.JumpOver,
        // corner: 5,
        toShortLength: 4 // avoid interfering with arrowhead or ovverreiding the arrowhead
      },

      { curve: go.Link.Bezier },

      {
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true
      },

      // Link shape

      $(go.Shape,
        {   // thick undrawn path make it easier the click the link
          isPanelMain: true,
          stroke: "transparent",
          strokeWidth: 10
        }
      ),

      $(go.Shape,
        {   // the real drwan path default
          isPanelMain: true,
          stroke: "black",
          strokeWidth: 3
        }
      ),

      // Link arrowhead
      $(go.Shape,
        {   // make the arrowhead mor visibile and clear by scaling it
          toArrow: "Standard",
          scale: 1.5
        }
      ),


      // Link Label
      $(go.TextBlock,
        {
          text: 'Label',
          editable: true,
          textAlign: 'center',
          font: '14px Roboto',
          segmentOffset: new go.Point(0, -10),
          segmentOrientation: go.Link.OrientUpright,
        },
      ),

      /**
       * Handling mmouse events (mouse over the Link)
       */
      {
        // a mouse-over highlights the link by changing the first main path shape's stroke:
        mouseEnter: function (e, link) { link.elt(0).stroke = "rgba(152, 193, 217, 1)"; },
        mouseLeave: function (e, link) { link.elt(0).stroke = "transparent"; }
      }
    );


  // initialize Overview
  myOverview =
    $(go.Overview, "myOverviewDiv",
      {
        observed: myDiagram,
        contentAlignment: go.Spot.Center
      });

  // initialize Palette
  myPalette =
    $(go.Palette, "myPaletteDiv",
      {
        nodeTemplate: myDiagram.nodeTemplate,
        contentAlignment: go.Spot.Center,
        layout:
          $(go.GridLayout,
            { wrappingColumn: 1, cellSize: new go.Size(2, 2) }),
      });

  // now add the initial contents of the Palette
  myPalette.model.nodeDataArray = [
    // { text: "Square", color: "purple", figure: "Square" },
    // { text: "Rectangle", color: "red", figure: "Rectangle" },
    { text: "Rounded\nRectangle", color: "green", figure: "RoundedRectangle" },
    // { text: "Triangle", color: "purple", figure: "Triangle" },
  ];

  var inspector = new Inspector('myInspectorDiv', myDiagram,
    {
      includesOwnProperties: false,
      properties: {
        // Application properties - properties window
        "Name": {},
        "Version": {},
        "Description":{},
        "COTS":{},
        "Release date":{},
        "Shutdown date":{},
        "color": { type: 'color' },
      }
    });


}

window.addEventListener('DOMContentLoaded', init);
