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
    $(go.Node, "Horizontal",
      { background: "#44CCFF" },


      $(go.TextBlock,
        "Default Text",
        { margin: 12, stroke: "white", font: "bold 16px sans-serif", editable: true },
        new go.Binding("text", "name")
      ),


      $(go.Shape, "RoundedRectangle",
        {
          portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
          // allow all kinds of links from and to this port
          // An link can only be between two different Nodes
          fromLinkable: true, fromLinkableSelfNode: false, fromLinkableDuplicates: true,
          toLinkable: true, toLinkableSelfNode: false, toLinkableDuplicates: true
        },
        new go.Binding("fill", "color")
      ),

    );


  var model = $(go.GraphLinksModel);
  // for each object in this Array, the Diagram creates a Node to represent it
  model.nodeDataArray = [
    { key: 1, name: "Test1" },
    { key: 2, name: "Test2" },
    { key: 3, name: "Test3" }
  ];

  model.linkDataArray =
    [
      { from: 1, to: 2 },
      { from: 2, to: 3 }
    ];
  myDiagram.model = model;

}
