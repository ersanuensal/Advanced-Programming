function init() {

  // short form for defining templates
  var $ = go.GraphObject.make;
//  const today = new Date();
  today2 = getTodayTime();

  console.log(today2);


  myDiagram =
    $(go.Diagram, "myDiagramDiv", // create Diagramm in HTML
      {
        // create new node with doube click
        "clickCreatingTool.archetypeNodeData": {
          Name: "Application",
          Version: "",
          Description: "",
          State: "",
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



  // The link shape and arrowhead have their stroke brush data bound to the "color" property
  myDiagram.linkTemplate =
    $(go.Link, {
      toShortLength: 8, // avoid interfering with arrowhead or ovverreiding the arrowhead,
      curve: go.Link.Bezier,
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

      $(go.Shape,
        { // thick undrawn path make it easier the click the link
          isPanelMain: true,
          stroke: "transparent",
          strokeWidth: 8,
          toShortLength: 8
        }
      ),

      $(go.Shape,
        { // the real drwan path default
          isPanelMain: true,
          strokeWidth: 4
        },
        new go.Binding("stroke", "Color").makeTwoWay()
      ),

      // Link arrowhead

      $(go.Shape,
        { // make the arrowhead more visibile and clear by scaling it
          toArrow: "Standard",
          scale: 1.5
        },
        new go.Binding("stroke", "Color").makeTwoWay(),
        new go.Binding("fill", "Color").makeTwoWay(),
      ),

      // Link Label
      /*
      link label is not just a simple text, it#s a node like object
      */

      $(go.Panel, "Auto", // this whole Panel is a link label
        $(go.Shape, "RoundedRectangle",
          {
            fill: 'white',
            stroke: "#eeeeee",
            strokeWidth: 3
          }
        ),
        $(go.Panel, "Table",
          {
            margin: 8,
            stretch: go.GraphObject.Fill
          },
          $(go.TextBlock,
            {
              row: 0,
              alignment: go.Spot.Center,
              margin: new go.Margin(3, 24, 3, 2), // leave room for Button
              font: "bold 16px sans-serif"
            },
            new go.Binding("text", "Name")
          ),
          $("PanelExpanderButton", "HIDEN", // the name of the element whose visibility this button toggles
            {
              row: 0,
              alignment: go.Spot.TopRight
            }
          ),
          $(go.RowColumnDefinition,
            {
              row: 1,
              separatorStrokeWidth: 1.5,
              separatorStroke: "#eeeeee"
            }),
          $(go.Panel, "Table",
            {
              name: "HIDEN",
              width: 150,
              row: 1
            },
            $(go.RowColumnDefinition,
              {
                row: 1,
                separatorStrokeWidth: 1.5,
                separatorStroke: "#eeeeee"
              }
            ),
            $(go.TextBlock,
              {
                row: 0,
                alignment: go.Spot.Left,
                font: "bold 13px sans-serif",
                wrap: go.TextBlock.WrapFit,
                width: 150,
                textAlign: "left",
              },
              new go.Binding("text", "Description"),
            ),

            /**personal Data: true or false*/
            $(go.TextBlock,
              {
                row: 1,
                alignment: go.Spot.Left,
                margin: new go.Margin(3, 2, 3, 2),
                font: "bold 13px sans-serif",
                text: "Personal Data: "
              }
            ),
            $(go.TextBlock,
              {
                row: 1,
                alignment: go.Spot.Right,
                margin: new go.Margin(3, 2, 3, 2),
                font: "bold 13px sans-serif",
              },
              new go.Binding("text", "PersonalData")
            ),
          )
        )
      )
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
      State: "",
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
      "Name": {},
      "Version": {
        show: Inspector.showIfNode
      },
      "Description": {
        // show: Inspector.showIfNode
        type: "field"
      },
      "COTS": {
        show: Inspector.showIfNode,
        type: "select",
        choices: function (node, propName) {
          if (Array.isArray(node.data.choices)) return node.data.choices;
          return ["COTS", "Propietary", "Undefined"];
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
      "Color": {
        show: Inspector.showIfLink,
        type: 'color',
      },
      "PersonalData": {
        show: Inspector.showIfLink,
        type: "checkbox"
      }
    }


  });



  // This function is for to show or hide the inspector
  myDiagram.addDiagramListener("ChangedSelection", function (diagramEvent) {
    let selectedPart = myDiagram.selection.first();

    if (selectedPart == null) {
      document.getElementById("myInspectorDiv").style.display = "none";
    } else {
      document.getElementById("myInspectorDiv").style.display = "initial";
    }

    myDiagram.commit(function (d) { // this Diagram

      // iterate over all nodes in Diagram
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

      });

    });


  });


}



function showData() {

  var json = myDiagram.model.toJson();

  console.log(json);

}


window.addEventListener('DOMContentLoaded', init);
