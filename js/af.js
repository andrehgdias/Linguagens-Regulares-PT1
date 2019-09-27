// ---------- ---------- ---------- ---------- ---------- //
// create an array with nodes
let nodesData = new vis.DataSet([
  { id: 1, label: "Node 1" },
  { id: 2, label: "Node 2" },
  { id: 3, label: "Node 3" },
  { id: 4, label: "Node 4" },
  { id: 5, label: "Node 5" }
]);

// create an array with edges
let edgesData = new vis.DataSet([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 5, to: 5 }
]);
// ---------- ---------- ---------- ---------- ---------- //
let edges = {
  arrows: {
    to: { enabled: true }
  },
  arrowStrikethrough: true,
  color: {
    color: "#4a4a4a",
    highlight: "#4a4a4a",
    hover: "#4a4a4a",
    inherit: "from",
    opacity: 1.0
  }
};

let nodes = {
  shape: "circle",
  size: 15
};

let interaction = {
  hover: true
  // hoverConnectedEdges: false,
  // selectConnectedEdges: false
};

let manipulation = {
  enabled: true,
  initiallyActive: true
};

let physics = {
  enabled: false
};

let options = {
  height: "100%",
  width: "100%",
  locale: "pt-br",
  clickToUse: true,
  edges,
  nodes,
  interaction,
  manipulation,
  physics
};
// ---------- ---------- ---------- ---------- ---------- //
// subscribe to any change in the DataSet
nodesData.on('*', function (event, properties, senderId) {
    console.log('event', event, properties);
    console.log(nodesData);
    console.log(edgesData);

  });
  
// create a network
let container = document.getElementById("canvasvis");

// provide the data in the vis format
let data = {
  nodes: nodesData,
  edges: edgesData
};

// initialize your network!
let network = new vis.Network(container, data, options);
