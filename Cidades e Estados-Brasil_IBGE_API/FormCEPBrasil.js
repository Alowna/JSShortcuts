//preencher estados
async function fillStates() {
    const selectDiv = document.getElementById("estado")
    
    try {
        // Requisição para buscar todos os estados na api
        const response = await fetch('https://brasilapi.com.br/api/ibge/uf/v1');
        const estados = await response.json();

        for (const estado of estados) {
           
            // para cada estado, cria um option com o nome do estado e sua sigla como value, que vai ser usada depois para pesquisar cada cidade
            actualState = document.createElement("option")
            actualState.setAttribute("value", `${estado.sigla}`)
            actualState.innerText = `${estado.nome}`
            selectDiv.appendChild(actualState)
        }            
    } catch (erro) {
        console.error('Erro ao buscar os estados:', erro);
    }
}
fillStates()

let actualCities = [];

async function getStateCities(choosenState) {
    try {
        //pega todos os estados pela api
        const response = await fetch('https://brasilapi.com.br/api/ibge/uf/v1');
        const estados = await response.json();
        //verifica a equivalencia com a sigla de choosenState
        for (const estado of estados) {
            
            if(estado.sigla == choosenState){
                
                const cidades = await getCityPerState(estado.sigla);
                
                actualCities = [].concat(cidades);   
            }
            
        }

    } catch (erro) {
        console.error('Erro ao buscar os estados:', erro);
    }
}

async function getCityPerState(choosenState) {
    try {
        const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${choosenState}`);
        const cidades = await response.json();
        
        return cidades.map(cidade => cidade.nome);
    } catch (erro) {
        console.error(`Erro ao buscar cidades para o estado ${choosenState}:`, erro);
        return [];
    }
}

function createCities(select){
    const selectDiv = document.getElementById("cidade")
//limpa o select de cidades
    while(selectDiv.firstChild){
        selectDiv.removeChild(selectDiv.firstChild)
    }
//limpa a array das cidades pegas na API
    while(actualCities.length>0){
        actualCities.pop()
    }
    
    getStateCities(select.value).then(()=>{
        //coloca de volta o "-- Sua Cidade --" que é retirado no while anterior. A fim de manter o padrão
            emptyValue = document.createElement("option")
            emptyValue.innerText = "-- Sua Cidade --"
            emptyValue.disabled = true
            selectDiv.appendChild(emptyValue)
    
        value = 0            
        for(cidade of actualCities){
            //adiciona cidade por cidade como um elemento de opção, atribuindo value como id, que se incrementa a cada cidade
            value++
            actualCity = document.createElement("option")
            actualCity.setAttribute("value", `${value}`)
            actualCity.innerText = `${cidade}`
            selectDiv.appendChild(actualCity) 
        }
    });
}

