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
  selectConnectedEdges: true
};

let manipulation = {
  enabled: false,
  // initiallyActive: true
  addNode: function (nodeData, callback) {
    let maxId = nodesData.max("id");
    let id = maxId != null ? maxId.id + 1 : 1;
    nodeData.id = id;
    nodeData.label = "q" + id;
    callback(nodeData);
  },
  addEdge: async function (edgeData, callback) {
    console.warn("Adding Edge");
    let input = await Swal.fire({
      title: "Qual o simbolo que será validado?",
      input: "text",
      inputValidator: value => {
        if (value.length > 1 || !value.length) {
          return "O simbolo deve ser unitário!";
        }
      },
      type: "question"
    });

    console.warn(input);
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
    if (clickedNode.id === (nodesAux.initial ? nodesAux.initial.id : -1)) {
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

nodesData.on("*", function (event, properties, senderId) {
  console.log("event", event, properties);
  console.log(nodesData);
  console.log(edgesData);
});

initialButton.hide();
finalButton.hide();
network.on("click", function (properties) {
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
// ---------- ---------- ---------- ---------- ---------- //
// Testando Strings
const inputStringUnica = $("#stringUnica");
const buttonStringUnica = $("#confirmaUnica");

const inputString1 = $("#string1");
const inputString2 = $("#string2");
const inputString3 = $("#string3");
const inputString4 = $("#string4");

const buttonStringMultipla = $("#confirmaMultipla");

const validateString = arreyString => {
  // Se estiver validando apenas 1 string, o arrey terá apenas um item, se for para multipla, será 4 strings
  console.log("Validating", arreyString);
  console.log(arreyString.length);
  console.log("Nodes data", nodesData);
  console.log("Nodes aux", nodesAux);
  console.log("Edge data", edgesData);

  let nodeInicial = nodesAux.initial;
  if (nodeInicial) {
    let nodesFinal = nodesAux.final;
    if (nodesFinal.length > 0) {
      if (arreyString.length === 1) {
        // Unica
        if (checkString(arreyString[0], nodeInicial.id))
          Swal.fire({
            title: "Uhuuuuuu",
            text: `Sua string ${arreyString[0]} foi aceita!`,
            type: "success"
          });
        else
          Swal.fire({
            title: "Ah, que pena!",
            text: `Sua string ${arreyString[0]} foi rejeitada :(`,
            type: "error"
          });
      } else if (arreyString.length === 4) {
        // Multipla
        console.warn("Multipla");
        let accepted = [];
        for (let string of arreyString) {
          if (checkString(string, nodeInicial.id)) {
            console.log(string, " foi aceita");
            accepted.push(string);
          } else {
            console.log(string, " foi rejeitada");
          }
        }
        if (accepted.length) {
          let text = "";
          text = accepted[0];
          if (accepted.length > 1)
            for (let i = 1; i < accepted.length; i++)
              text = text + ", " + accepted[i];

          Swal.fire({
            title: "Uhuuuuuu",
            text: `Suas strings ${text} foi aceita!`,
            type: "success"
          });
        } else {
          Swal.fire({
            title: "Ah, que pena!",
            text: `Suas strings foram rejeitadas :(`,
            type: "error"
          });
        }
      }
    } else {
      Swal.fire({
        title: "Sem estados finais!",
        text: "Defina ao menos um estado final",
        type: "error"
      });
    }
  } else {
    Swal.fire({
      title: "Sem estados iniciais!",
      text: "Defina um estado incial",
      type: "error"
    });
  }
};

buttonStringUnica.click(function () {
  console.log("String unica");
  validateString([inputStringUnica.val()]);
});

buttonStringMultipla.click(function () {
  console.log("String multipla");
  validateString([
    inputString1.val(),
    inputString2.val(),
    inputString3.val(),
    inputString4.val()
  ]);
});

const hasTransition = (nodeId, transicao) => {
  let result = [];

  for (var key in edgesData._data) {
    let transicoes = edgesData._data[key].label;
    console.log("Transições", transicoes);
    for (let i = 0; i < transicoes.length; i++) {
      if (edgesData._data[key].from === nodeId && transicoes[i] === transicao) {
        result.push(edgesData._data[key].to);
        console.log("Result", result);
      }
    }
  }

  return result;
};

const isFinal = nodeId => {
  for (let i = 0; i < nodesAux.final.length; i++) {
    if (nodesAux.final[i].id === nodeId) return true;
  }
  return false;
};

const checkString = (text, nodeId) => {
  let charAtual = text.charAt(0);
  let candidates = hasTransition(nodeId, charAtual);

  console.log("Node", nodeId);

  if (candidates.length === 0) {
    if (isFinal(nodeId) && text.length === 0) {
      //chegou no fim do texto e atingiu um estado final
      return true;
    }
  }

  for (let i = 0; i < candidates.length; i++) {
    if (checkString(text.substring(1), candidates[i])) {
      return true;
    }
  }

  return false;
};

const describe = () => {
  console.info("Describing");
  console.log("Nodes", nodesData);
  console.log("Edges", edgesData);
  console.warn("Edges data", edgesData._data);
  // let ids = nodesData.getIds();
  // console.log(ids);
  // nodesData.add({
  //   id: ids[ids.length - 1] + 1,
  //   label: "q" + (ids[ids.length - 1] + 1)
  // });
};
const exportAf = async event => {
  if (nodesData.length > 0) {
    let conteudo =json2xml(nodesData, edgesData, nodesAux.initial, nodesAux.final);
    let blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    let input = await Swal.fire({
      title: "Qual o nome do arquivo?",
      input: "text",
      inputValidator: value => {
        if (!value.length) {
          return "Insira um nome";
        }
      },
      type: "question"
    })
    let titulo = input.value;
    saveAs(blob, titulo + ".jff");

  } else {
    Swal.fire({
      title: "Erro!",
      text: "Não há nenhum automato definido!",
      type: "error"
    });
  }
}

const openFile = event => {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function () {
    if (reader.result) {
      var text = reader.result;

      parser = new DOMParser();
      xmlDoc = parser.parseFromString(text, "text/xml");

      let json = JSON.parse(xml2json(xmlDoc, "    "));
      delete json.structure.automaton["#comment"];
      console.info("xml parsed without comment", json);

      if (json.structure.type === "fa") {
        let nodes = json.structure.automaton.state;
        let edges = json.structure.automaton.transition;

        buildAf(nodes, edges);

        let jsonConvertedAsXml = json2xml(json, "");
        console.log("JSON parsed", jsonConvertedAsXml);
      } else {
        Swal.fire({
          title: "Arquivo inválido!",
          text: "O arquivo selecionado não é um AF exportado pelo JFLAP",
          type: "error"
        });
      }
    }
  };
  reader.readAsText(input.files[0]);
};

const buildAf = (nodes, edges) => {
  nodes.forEach(node => {
    nodesData.add({
      id: node["@id"],
      label: node["@name"],
      x: node.x,
      y: node.y
    });

    if (node.hasOwnProperty("initial")) {
      if (node.hasOwnProperty("final")) {
        let config = {
          id: node["@id"],
          color: {
            border: "#eba134",
            background: "#ffc570",
            highlight: {
              border: "#b56e04",
              background: "#ff9f12"
            }
          }
        };
        nodesAux.final.push(config);
        nodesAux.initial = config;
      } else {
        nodesAux.initial = {
          id: node["@id"],
          color: {
            border: "#555",
            background: "#ccc",
            highlight: {
              border: "#000",
              background: "#fff"
            }
          }
        };
      }
      nodesData.update(nodesAux.initial);
    } else if (node.hasOwnProperty("final")) {
      nodesAux.final.push({
        id: node["@id"],
        color: {
          border: "#ff0000",
          background: "#cc5555",
          highlight: {
            border: "#550000",
            background: "#aa2222"
          }
        }
      });
      var index = nodesAux.final.findIndex(
        nodeAux => nodeAux.id === node["@id"]
      );
      console.log(index);
      nodesData.update(nodesAux.final[index]);
    }
  });
  let i = 1;
  edges.forEach(edge => {
    var ids = edgesData.getIds();
    edgesData.update({
      id: ids.length > 0 ? ids[ids.length - 1] + 1 : i,
      from: edge.from,
      to: edge.to,
      label: edge.read
    });
    i++;
  });
};

// ==================================================================================
class regra {
  constructor(lhs, terminal, rhs) {
    this.i = 0;
    this.lhs = lhs;
    this.variaveis = [];
    this.rhs = rhs;
    this.terminal = terminal;
  }

  setVariaveis(variavel) {
    //console.log(variavel);
    this.variaveis[this.i] = variavel;
    this.i++;
  }

  getVariavel() {
    return this.rhs;
  }

  getVariaveis() {
    return this.variaveis;
  }

  getLhs() {
    return this.lhs;
  }

  getRhs() {
    return this.rhs;
  }

  getTerminal() {
    return this.terminal;
  }
}

class gramatica {
  constructor(regras, raiz) {
    this.regras = regras;
    this.raiz = raiz; //do tipo rega
  }

  getRegras() {
    return this.regras;
  }

  getRaiz() {
    return this.raiz;
  }

  verifica(entrada) {
    let i = 0;
    let k = 0;
    let testa = this.raiz;
    let anterior = testa;
    if (testa !== undefined)
      while (
        testa !== undefined &&
        anterior !== undefined &&
        i < entrada.length &&
        (i > 0 || i === 0)
      ) {
        if (testa.getTerminal() === entrada[i]) {
          k = 0;
          anterior = testa;
          testa = testa.getVariaveis()[k];
          i++;
          console.log(testa);
        } else if (testa.getTerminal() === "\u03BB") {
          k++;
          testa = testa.getVariaveis[k];
          i++;
          console.log("b");
        } else {
          k++;
          testa = anterior.getVariaveis()[k];
          console.log(testa);
          if (testa !== undefined) if (testa.getTerminal() !== entrada[i]) i--;
          console.log("c");
        }
      }
    if (testa === undefined && i === entrada.length) return true;
    else return false;
  }

  buscaVariavel(naoTerm) {
    //console.log(naoTerm);
    for (let i = 0; i < this.regras.length; i++) {
      //console.log(this.regras[i]);
      if (this.regras[i].getLhs() === naoTerm) {
        //console.log(this.regras[i]);
        return this.regras[i];
      }
      return null;
    }
  }
}



criaGR = function () {
  let table = document.getElementById("products-table");
  let linha = table.getElementsByTagName("tr");
  let aux = "",
    LHS = "";
  let regras = [];
  let quant = 0;

  for (let i = 1; i < linha.length - 1; i++) {
    //primeiro for pra percorrer a linha
    let lhs = linha[i].getElementsByTagName("input")[0].value;
    let rhs = linha[i].getElementsByTagName("input")[1].value;

    aux = rhs;
    LHS = lhs;
    if (LHS !== "") {
      if (aux !== null && LHS !== null && "" !== aux) {
        if (aux.length > 2) {
          aux.trim();
        }
        for (let j = 0; j < aux.length; j++) {
          //segundo for pra percorrer a regrara
          if (aux.length > 1) {
            if (aux.charAt(j) !== "|" && j + 1 === aux.length) {
              regras[quant] = new regra(LHS.charAt(0), aux.charAt(j), "0");
              console.log("1");
            } else if (aux.charAt(j) !== "|" && aux.charAt(j + 1) !== "|") {
              regras[quant] = new regra(
                LHS.charAt(0),
                aux.charAt(j),
                aux.charAt(j + 1)
              );
              j = j + 2;
              console.log("2");
            } else if (aux.charAt(j) !== "|" && aux.charAt(j + 1) === "|") {
              regras[quant] = new regra(LHS.charAt(0), aux.charAt(j), "0");
              j = j + 1;
              console.log("3");
            } else if (aux.charAt(j) === "|") {
              j++;
              console.log("4");
            }
          } else {
            console.log("5");
            regras[quant] = new regra(LHS.charAt(0), aux.charAt(j), "0");
          }
          quant++;
        }
      }
      if (aux === "") {
        regras[quant] = new regra(LHS.charAt(0), "\u03BB", "0");
        console.log("6");
        quant++;
      }
    }
  }
  let gr = new gramatica(regras, regras[0]);
  return gr;
};

function ligaVariaveis(gr) {
  for (let k = 0; k < gr.regras.length; k++) {
    for (let j = 0; j < gr.regras.length; j++) {
      if (gr.regras[k].getRhs() === gr.regras[j].getLhs()) {
        gr.regras[k].setVariaveis(gr.regras[j]);
      }
    }
  }
}

function linguagem() {
  let gr = criaGR();
  let table = document.getElementById("products-table");
  let linha = table.getElementsByTagName("tr");
  ligaVariaveis(gr);
  // console.log(gr.regras[0]);
  let entrada = document.getElementById("entrada").value;
  let inicial = linha[1].getElementsByTagName("input")[0].value;
  if (gr.verifica(entrada)) alert("Válida");
  else alert("Inválida");
  return;
}

function adicionado(estado, aux) {
  if (aux && aux !== [])
    for (let i = 0; i < aux.length; i++) {
      if (estado === aux[i]) return i;
    }
  return null;
}

function criaEstados() {
  console.warn("Criando estado");
  let gr = criaGR();
  let regras = gr.getRegras();
  var adicionados = [];
  var a = 1;
  console.log(gr.getRaiz().getLhs());
  adicionados[a] = gr.getRaiz().getLhs();
  nodesData.add({
    id: a,
    label: gr.getRaiz().getLhs(),
    x: Math.random() * 300,
    y: Math.random() * 150
  });

  nodesAux.initial = {
    id: a,
    color: {
      border: "#555",
      background: "#ccc",
      highlight: {
        border: "#000",
        background: "#fff"
      }
    }
  };
  nodesData.update(nodesAux.initial);
  console.info("Estado criado Inicial: Label/id -> ", adicionados[a], a);
  a++; //2

  console.log("Valor de a: ", a);
  for (let i = 0; i < regras.length; i++) {
    if (adicionado(regras[i].getLhs(), adicionados)) {
      let resposta = criaTransicao(regras[i], adicionados, a);
      console.log("Valor de a: ", a);
      console.warn("Retorno da transição, valor de a: ", resposta.a);
      adicionados = resposta.adicionados;
      a = resposta.a;
    } else {
      adicionados[a] = regras[i].getLhs();
      nodesData.add({
        id: a,
        label: adicionados[a],
        x: Math.random() * 300,
        y: Math.random() * 150
      });
      // a++;
      let resposta = criaTransicao(regras[i], adicionados, a);
      adicionados = resposta.adicionados;
      a = resposta.a;
    }
  }
  $(".tabs").tabs("select", "af");
}

function criaTransicao(regra, adicionados, a) {
  console.warn("Criando transição");

  let terminal = regra.getTerminal();
  if (regra.getRhs() !== "0") {
    console.info("Possui RHS: ", regra.getLhs(), regra.getRhs());

    if (adicionado(regra.getRhs(), adicionados)) {
      console.warn("Manda p final");
    } else {
      console.warn("Criando Estado dentro da função transição");
      console.log("Valor de a: ", a);
      a++;
      console.log(
        "Vetor adicionados antes de criar o estado na posição  'a': ",
        adicionados,
        a
      );
      adicionados[a] = regra.getRhs();
      nodesData.add({
        id: a,
        label: adicionados[a],
        x: Math.random() * 300,
        y: Math.random() * 150
      });
      console.info("Estado criado: Label/id -> ", adicionados[a], a);
      a++;
      console.log("Novo valor de a: ", a);
    }

    var ids = edgesData.getIds();
    console.log("ids: ", ids);
    edgesData.update({
      id: ids.length > 0 ? ids[ids.length - 1] + 1 : 1,
      from: adicionado(regra.getLhs(), adicionados),
      to: adicionado(regra.getRhs(), adicionados),
      label: terminal
    });
    console.log(regra.getLhs() + " " + terminal + " " + regra.getRhs());
  } else {
    if (!adicionado("Z", adicionados)) {
      adicionados[a] = "Z";
      nodesData.add({
        id: a,
        label: "Z",
        x: Math.random() * 300,
        y: Math.random() * 150
      });

      nodesAux.final = [
        {
          id: a,
          color: {
            border: "#ff0000",
            background: "#cc5555",
            highlight: {
              border: "#550000",
              background: "#aa2222"
            }
          }
        }
      ];
      nodesData.update(nodesAux.final[0]);
      a++;
    }
    console.log(regra.getLhs() + " " + "\u03BB" + " " + "final");
    var ids = edgesData.getIds();
    console.log("ids: ", ids);
    edgesData.update({
      id: ids.length > 0 ? ids[ids.length - 1] + 1 : 1,
      from: adicionado(regra.getLhs(), adicionados),
      to: adicionado("Z", adicionados),
      label: terminal
    });
  }
  return { adicionados, a };
}


function AFgr() {
  let i = 1;
  let novasRegras = [];
  let j = 0;
  let letra = 65;
  let inicial;
  if (nodesAux.initial === null) alert("Sem estados inicial e/ou finais!");
  else {
    inicial = nodesAux.initial.id;
    if (nodesData._data[i].label === "q1") {
      while (nodesData._data[i] !== undefined && letra < 90) {
        if (nodesData._data[i].id === inicial) nodesData._data[i].label = String.fromCharCode(83);
        else {
          if (letra === 83) {
            letra++;
          }
          else {
            nodesData._data[i].label = String.fromCharCode(letra);
            letra++;
          }
        }

        i++;
      }
    }
  }

  i = 1;

  while (edgesData._data[i] !== undefined) {
    let LHS = nodesData.get(edgesData._data[i].from).label;
    let RHS = nodesData.get(edgesData._data[i].to).label;
    let terminal = edgesData._data[i].label;
    if(buscaTransicao(edgesData._data[i].to)){
      novasRegras[j] = new regra(LHS, terminal, RHS); 
    }
    else{
      novasRegras[j] = new regra(LHS, terminal, " ");
    }
    i++;
    if (LHS === "S") inicial = j;
    j++;
  }
  let novaGR = new gramatica(novasRegras, novasRegras[inicial]);
  console.log(novaGR.getRaiz());
  ligaVariaveis(novaGR);
  GRtable(novaGR);
  $(".tabs").tabs("select", "gramatica");
}

function buscaTransicao(id){
  let i=1;
  while (edgesData._data[i] !== undefined) {
    if(edgesData._data[i].from===id){
      return true;
    }
    else i++;
  }
  return false;
}

function GRtable(gr){
  regras = gr.getRegras();
  let table = document.getElementById("products-table");
  let cols = "";  
  let linha = table.getElementsByTagName("tr");
  linha[1].getElementsByTagName("input")[0].value=regras[0].getLhs();
  linha[1].getElementsByTagName("input")[1].value=regras[0].getTerminal()+regras[0].getRhs();
  cols+=linha;
  for(let i=1;i<regras.length;i++){
    let newRow = $("<tr>");
    let cols = "";
      cols += '<td><input value='+regras[i].getLhs()+'></td>';
      cols += '<td><input value='+regras[i].getTerminal()+regras[i].getRhs()+'><td>';
      cols +=
      '<button class="waves-effect waves-light red darken-1 btn-small" onclick="RemoveTableRow(this)" type="button">Remover</button>';
      cols += "</td>";
      newRow.append(cols);
    $("#products-table").append(newRow);
    }
  }