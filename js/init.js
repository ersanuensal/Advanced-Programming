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
            fromLinkableDuplicates: true, toLinkableDuplicates: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true
          },
          new go.Binding("stroke", "color"),
          new go.Binding("figure")),
      //    new go.Binding("fill", "color")),
        $(go.TextBlock,
          {
            margin: new go.Margin(5, 5, 3, 5), font: "10pt sans-serif",
            minSize: new go.Size(16, 16), maxSize: new go.Size(120, NaN),
            textAlign: "center", editable: true
          },
          new go.Binding("text").makeTwoWay())
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
       { text: "Square", color: "purple", figure: "Square" },
       { text: "Rectangle", color: "red", figure: "Rectangle" },
       { text: "Rounded\nRectangle", color: "green", figure: "RoundedRectangle" },
       { text: "Triangle", color: "purple", figure: "Triangle" },
     ];

     var inspector = new Inspector('myInspectorDiv', myDiagram,
       {
         // uncomment this line to only inspect the named properties below instead of all properties on each object:
         // includesOwnProperties: false,
         properties: {
           "Name": {},
           // key would be automatically added for nodes, but we want to declare it read-only also:
           "key": { readOnly: true, show: Inspector.showIfPresent },
           // color would be automatically added for nodes, but we want to declare it a color also:
           "color": { type: 'color' },
           "figure": {}
         }
       });


}
