class regra{	
	constructor(lhs,terminal,rhs){
		this.i=0;
		this.lhs=lhs;
		this.variaveis= [];
		this.rhs=rhs;
		this.terminal=terminal;
	}

	setVariaveis(variavel){
		//console.log(variavel);
		this.variaveis[this.i]=variavel;
		this.i++;
	}

	getVariavel(){
		return this.rhs;
	}

	getVariaveis(){
		return this.variaveis;
	}

	getLhs(){
		return this.lhs;
	}

	getRhs(){
		return this.rhs;
	}

	getTerminal(){
		return this.terminal;
	}


}

class gramatica{
	constructor(regras,raiz){
		this.regras=regras;
		this.raiz=raiz;//do tipo rega 
	}

	getRegras(){
		return this.regras;
	}

	getRaiz(){
		return this.raiz;
	}

verifica(entrada){
	let i =0;
		let k=0;
		let	testa = this.raiz;
		let anterior=testa;
		while(testa!==undefined && anterior!==undefined && i< entrada.length && (i>0 ||i===0) ){
			if(testa.getTerminal()===entrada[i]){
				k=0;
				anterior = testa;
				testa = testa.getVariaveis()[k];
				i++;
				console.log(testa);
			}
			else if(testa.getTerminal()==="\u03BB"){ //arrumar vazio
 				k++;
				testa=testa.getVariaveis[k];
				i++;
				console.log("b");
			}
			else{
				k++;
				testa=anterior.getVariaveis()[k];
				console.log(testa);
				if(testa.getTerminal()!==entrada[i]) i--;
								console.log("c");
			}
		}
		if(testa===undefined  && i===entrada.length) return true;
		else return false;
	}

	buscaVariavel(naoTerm){
	//console.log(naoTerm);
		for(let i=0;i<this.regras.length;i++){
			//console.log(this.regras[i]);		
			if(this.regras[i].getLhs()===naoTerm){
			//console.log(this.regras[i]);
				return this.regras[i];
			}
		return null;
		}
	}

}

criaGR = function (){
    let table = document.getElementById("products-table");
    let linha = table.getElementsByTagName("tr");
    let aux = "", LHS = "";
    let regras= [];
    let quant=0;
 
   
    for(let i=1;i<linha.length-1;i++){ //primeiro for pra percorrer a linha
        let lhs = linha[i].getElementsByTagName("input")[0].value;
        let rhs = linha[i].getElementsByTagName("input")[1].value;
        

        aux =  rhs;
        LHS = lhs;
        if (aux !== null && LHS !== null && ""!==aux) {
            if (aux.length > 2) {
                aux.trim();
            }
			for (let j = 0; j < aux.length; j++) { //segundo for pra percorrer a regrara
                if (aux.length > 1) {
                    if (aux.charAt(j) !== '|' && j + 1 === aux.length) {
						regras[quant] = new regra(LHS.charAt(0), aux.charAt(j), '0');
						console.log("1");
                    } else if (aux.charAt(j) !== '|' && aux.charAt(j + 1) !== '|') {
                        regras[quant] = new regra(LHS.charAt(0), aux.charAt(j), aux.charAt(j + 1));
						j = j + 2;
						console.log("2");
                    } else if (aux.charAt(j) !== '|' && aux.charAt(j + 1) === '|') {
                        regras[quant] = new regra(LHS.charAt(0), aux.charAt(j), '0');
							j = j + 1;
							console.log("3");
                    } else if (aux.charAt(j) === '|') {
						j++;
						console.log("4");
                    }
                } else {
					console.log("5");
                    regras[quant] = new regra(LHS.charAt(0), aux.charAt(j), '0');
					
				}
                quant++;
            }
		}
		if(aux===""){
			regras[quant]=new regra(LHS.charAt(0),"\u03BB",'0');
			console.log("6");
			quant++;
		} 
    }
	let gr = new gramatica(regras,regras[0]);
	return gr;
}

function linguagem(){
	let gr=criaGR();
	let table = document.getElementById("products-table");
	let linha = table.getElementsByTagName("tr");
    for(let k=0;k<gr.regras.length;k++){
    	for (let j=0;j<gr.regras.length;j++){
    		if(gr.regras[k].getRhs()===gr.regras[j].getLhs()){
    			gr.regras[k].setVariaveis(gr.regras[j]);
    		}
		}
    }
   // console.log(gr.regras[0]);
    let entrada = document.getElementById("entrada").value;
    let inicial=linha[1].getElementsByTagName("input")[0].value;    
    if(gr.verifica(entrada)) alert("Válida");
    else  alert("Inválida");
    return;
}

function adicionado(estado,aux){
	if(aux!=undefined)
		for(let i=0;i<aux.length;i++){
			if(estado === aux[i])
				return i;
		}
	return null;
}

function criaEstados(){
	let gr=criaGR();
	let regras = gr.getRegras();
	var  adicionados=[];
	var a=0;
	console.log(gr.getRaiz().getLhs());
	for(let i=0; i<regras.length;i++){
		if(adicionado(regras[i].getLhs(),adicionados)){
			adicionados = criaTransicao(regras[i],adicionados,a);
		}
		else{
			adicionados[a]=regras[i].getLhs();
			a++;
			adicionados=criaTransicao(regras[i],adicionados,a);
		}
	}
}

function criaTransicao(regra,adicionados,a){
	let terminal = regra.getTerminal();
	let id;
	if(regra.getRhs()!=="0"){
		if(adicionado(regra.getRhs(),adicionados)){
			id = adicionado(regra.getRhs(),adicionados);
		}
		else{
			console.log(adicionados);
			adicionados[a]=regra.getRhs();
			id = a;
			a++; 
		}
		console.log(regra.getLhs()+" "+terminal+" "+regra.getRhs());
	}
	else{
		if(terminal==="\u03BB"){
			console.log(regra.getLhs()+" "+"\u03BB" +" "+ "final");
		}
		else{
			console.log(regra.getLhs()+" "+terminal +" "+ "final");
		}
		
	}
	return adicionados;
}