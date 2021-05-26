function init() {

  // short form for defining templates
  var $ = go.GraphObject.make;
  const today = new Date();
  var today2 = today.toLocaleDateString();


  var myDiagram =
    $(go.Diagram, "myDiagramDiv", // create Diagramm in HTML
      {
        // create new node with doube click
        "clickCreatingTool.archetypeNodeData": {
          Name: "Application",
          color: "blue",
          figure: "Subroutine",
          dateToday: today2


        },
        // function redo and undo
        "undoManager.isEnabled": true
      }
    );

  // Defining a standard template for the nodes
  myDiagram.nodeTemplate =
    $(go.Node, "Auto", {
      locationSpot: go.Spot.Center
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
        new go.Binding("text", "Name").makeTwoWay()
      )


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
      new go.Binding("stroke", "color"),
      // Link shape

      $(go.Shape, { // thick undrawn path make it easier the click the link
        isPanelMain: true,
        stroke: "transparent",
        strokeWidth: 8,
        toShortLength: 8
      }),

      $(go.Shape, { // the real drwan path default
        isPanelMain: true,
        strokeWidth: 4
      },
        new go.Binding("stroke", "color")
      ),

      // Link arrowhead

      $(go.Shape, { // make the arrowhead more visibile and clear by scaling it
        toArrow: "Standard",
        scale: 1.5
      },
        new go.Binding("stroke", "color"),
        new go.Binding("fill", "color")

      ),

      // Link Label

      // $(go.TextBlock,
      //   {
      //     editable: true,
      //     textAlign: 'center',
      //     font: 'bold 16px Arial Rounded MT',
      //     segmentOffset: new go.Point(0, -10),
      //     segmentOrientation: go.Link.OrientUpright,
      //   },
      //   new go.Binding("stroke", "color"),
      //   new go.Binding("text", "Name").makeTwoWay()
      // ),


      $(go.Panel, "Auto",  // this whole Panel is a link label
        $(go.Shape, "RoundedRectangle",
          { fill: 'white', stroke: "#eeeeee", strokeWidth: 3 }
        ),
        $(go.Panel, "Table",
          { margin: 8, stretch: go.GraphObject.Fill },
          $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
          $(go.TextBlock,
            {
              row: 0,
              alignment: go.Spot.Center,
              margin: new go.Margin(3, 24, 3, 2),  // leave room for Button
              font: "bold 16px sans-serif"
            },
            new go.Binding("text", "Name")
          ),
          $("PanelExpanderButton", "HIDEN",  // the name of the element whose visibility this button toggles
            { row: 0, alignment: go.Spot.TopRight }
          ),
          $(go.Panel, "Table",
            { name: "HIDEN", row: 1 },
            $(go.RowColumnDefinition,
              { row: 1, separatorStrokeWidth: 1.5, separatorStroke: "#eeeeee" }
            ),
            $(go.TextBlock,
              {
                row: 0,
                alignment: go.Spot.Left,
                margin: new go.Margin(15, 10, 10, 10),  // leave room for Button
                font: "bold 13px sans-serif",
                wrap: go.TextBlock.WrapFit,
                textAlign: "left",
                width: 120
              },
              new go.Binding("text", "Description")
            ),
            $(go.Panel, "Vertical",
              {
                row: 1,
                padding: 3,
                alignment: go.Spot.TopLeft,
                defaultAlignment: go.Spot.Left,
                stretch: go.GraphObject.Horizontal,
                itemArray: [{ name: "Personal Data:", figure: "Decision", color: "red" }]
              },
            )
          )
        )
      ),
      /**
       * Handling mouse events (mouseover the Link)
       */
      {
        // a mouseover highlights the link by changing the first main path shape's stroke:
        mouseEnter: function (e, link) {
          link.elt(0).stroke = "rgba(152, 193, 217, 0.8)";
        },
        mouseLeave: function (e, link) {
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
      figure: "Subroutine",
      dateToday: today2
    },
    // { Name: "Triangle", color: "purple", figure: "Triangle" },
  ];


  var inspector = new Inspector('myInspectorDiv', myDiagram,
    {
      includesOwnProperties: false,
      properties: {
        // Application properties - properties window
        "Name": {},
        "Version": {
          show: Inspector.showIfNode
        },
        "Description": {
          // show: Inspector.showIfNode
        },
        "State": {
          show: Inspector.showIfNode,
          type: "select",
          choices: function (node, propName) {
            if (Array.isArray(node.data.choices)) return node.data.choices;
            return ["COTS", "Propietary", "Undefined"];
          }
        },
        "Release date": {
          show: Inspector.showIfNode,
          type: "date"
        },
        "Shutdown date": {
          show: Inspector.showIfNode,
          type: "date"
        },
        "color": {
          type: 'color'
        },
        "dateToday": { show: Inspector.showIfNode },
        "personal data?": {
          show: Inspector.showIfLink,
          type: "checkbox"
        }
      }
    }
  );

  // This function is for to show or hide the inspector
  myDiagram.addDiagramListener("ChangedSelection", function (diagramEvent) {
    let selectedPart = myDiagram.selection.first();

    if (selectedPart == null) {
      document.getElementById("myInspectorDiv").style.display = "none";
    } else {
      document.getElementById("myInspectorDiv").style.display = "initial";
    }
  });

  myDiagram.model = new go.TreeModel([  // specify the contents of the Palette
{"Name" : "test", key : "1"}
          ]);
var dataObj = myDiagram.model.findNodeDataForKey("1");
myDiagram.model.set(dataObj, "Name");

}


function save () {

  //file = myDiagram.model.toJSON();
  window.alert(myDiagram.model.toJson());
}


window.addEventListener('DOMContentLoaded', init);
