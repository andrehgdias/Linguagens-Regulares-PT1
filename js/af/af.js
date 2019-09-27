// ---------- ---------- ---------- ---------- ---------- //
// Configurações //
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
  size: 20,
  color: {
    border: "#2B7CE9",
    background: "#5faeE9",
    highlight: {
      border: "#000",
      background: "#fff"
    }
  }
};

let interaction = {
  hover: true,
  // hoverConnectedEdges: false,
  selectConnectedEdges: false
};

let manipulation = {
  enabled: false,
  // initiallyActive: true
  addNode: function(nodeData, callback) {
    let maxId = nodesData.max("id");
    let id = maxId != null ? maxId.id + 1 : 1;
    nodeData.id = id;
    nodeData.label = "q" + id;
    callback(nodeData);
  },
  addEdge: async function(edgeData, callback) {
    let input = await Swal.fire({
      title: "Qual o simbolo que será validado?",
      input: "text",
      inputValidator: value => {
        if (value.length > 1 || !value.length) {
          return "O simbolo deve ser unitário!";
        }
      }
    });
    let maxId = edgesData.max("id");
    let id = maxId != null ? maxId.id + 1 : 1;
    edgeData.label = input.value;
    edgeData.id = id;
    callback(edgeData);
  }
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
// Criando arrey de nós(estados)
let nodesData = new vis.DataSet();
let nodesAux = {
  initial: null,
  final: new Array()
};
let clickedNode = null;

// Criando arrey de arestas(transições)
let edgesData = new vis.DataSet();

let container = document.getElementById("canvasvis");
let data = {
  nodes: nodesData,
  edges: edgesData
};
let network = new vis.Network(container, data, options);
// ---------- ---------- ---------- ---------- ---------- //
// Controlando os botões
let addNodeButton = $("#addNode").tooltip();
let addEdgeButton = $("#addEdge").tooltip();
let deleteButton = $("#delete").tooltip();
let initialButton = $("#initial").tooltip();
let finalButton = $("#final").tooltip();

addNodeButton.on("click", () => {
  network.addNodeMode();
});

addEdgeButton.on("click", () => {
  network.addEdgeMode();
});

deleteButton.on("click", () => {
  network.deleteSelected();
});

initialButton.on("click", event => {
  if (nodesAux.initial) {
    let isFinal = nodesAux.final.filter(node => {
      return node.id === nodesAux.initial.id;
    });
    if (isFinal.length) {
      nodesAux.initial.color = {
        border: "#ff0000",
        background: "#cc5555",
        highlight: {
          border: "#550000",
          background: "#aa2222"
        }
      };
    } else {
      nodesAux.initial.color = {
        border: "#2B7CE9",
        background: "#5faeE9",
        highlight: {
          border: "#000",
          background: "#fff"
        }
      };
    }
    nodesData.update(nodesAux.initial);
  }

  let isFinal = nodesAux.final.filter(node => {
    return node.id === clickedNode.id;
  });
  if (isFinal.length) {
    clickedNode.color = {
      border: "#eba134",
      background: "#ffc570",
      highlight: {
        border: "#b56e04",
        background: "#ff9f12"
      }
    };
  } else {
    clickedNode.color = {
      border: "#555",
      background: "#ccc",
      highlight: {
        border: "#000",
        background: "#fff"
      }
    };
  }
  nodesAux.initial = clickedNode;
  nodesData.update(nodesAux.initial);
});

finalButton.on("click", event => {
  let toggle = nodesAux.final.filter(node => {
    return node.id === clickedNode.id;
  });
  if (toggle.length) {
    let index;
    if (clickedNode.id === nodesAux.initial.id) {
      index = nodesAux.final.indexOf(nodesAux.initial);
      clickedNode.color = {
        border: "#555",
        background: "#ccc",
        highlight: {
          border: "#000",
          background: "#fff"
        }
      };
    } else {
      index = nodesAux.final.indexOf(toggle);
      clickedNode.color = {
        border: "#2B7CE9",
        background: "#5faeE9",
        highlight: {
          border: "#000",
          background: "#fff"
        }
      };
    }
    nodesData.update(clickedNode);
    nodesAux.final.splice(index, 1);
  } else {
    if (clickedNode.id === (nodesAux.initial?nodesAux.initial.id:-1)) {
      clickedNode.color = {
        border: "#eba134",
        background: "#ffc570",
        highlight: {
          border: "#b56e04",
          background: "#ff9f12"
        }
      };
    } else {
      clickedNode.color = {
        border: "#ff0000",
        background: "#cc5555",
        highlight: {
          border: "#550000",
          background: "#aa2222"
        }
      };
    }
    nodesData.update(clickedNode);
    nodesAux.final.push(clickedNode);
  }
});

nodesData.on("*", function(event, properties, senderId) {
  console.log("event", event, properties);
  console.log(nodesData);
  console.log(edgesData);
});

// ---------- ---------- ---------- ---------- ---------- //
initialButton.hide();
finalButton.hide();
network.on("click", function(properties) {
  var ids = parseInt(properties.nodes.toString());
  console.log(ids);
  if (ids) {
    initialButton.show();
    finalButton.show();
    clickedNode = nodesData.get(ids);
    console.log("clicked nodes:", clickedNode);
  } else {
    initialButton.hide();
    finalButton.hide();
  }
});
