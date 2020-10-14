
var en = JSON.parse('{ "Método AHP-TOPSIS-2N":"AHP-TOPSIS-2N Method", "Registro das alternativas:":"Registration of alternatives", "Alternativas:":"Alternatives:", "+ Adicionar alternativa":"+ Add alternative", "- Remover alternativa":"- Remove alternative" ,"Registro dos critérios Quantitativos:" : "Record of Quantitative criteria:",' +
'"Critérios QUANTITATIVOS:" : "QUANTITATIVE criteria:",'+
'"+ Adicionar critério" : "+ Add criterion",'+
'"- Remover critério" : "- Remove criterion",'+
'"Valores dos critérios Quantitativos:" : "Quantitative criteria values:",'+
'"Prioridades entre critérios:" : "Criteria priorities:",'+
'"Anterior" : "Previous","Próximo" : "Next","RESULTADO - AHP-TOPSIS-2N":"RESULT - AHP-TOPSIS-2N","Erro de consistência":"Consistency error",'+
'"Consistência de":"Consistency of","Consistência da matriz de Saaty dos critérios :":"Consistency of the criteria Saaty matrix :",'+
'"D+ : Distância para a solução ideal positiva.":"D +: Distance to the ideal positive solution.","D- : Distância para a solução ideal negativa.":"D-: Distance to the ideal negative solution.","RS : Proximidade relativa.":"RS: Relative proximity.",'+
'" ➤ Matriz Resultado SQUARE":" ➤ SQUARE Result Matrix"," ➤ Matriz Resultado MINMAX":" ➤ MINMAX Result Matrix",'+
'" ➤ Matriz Resultado (Procedimento 1)":" ➤ Result Matrix (Procedure 1)"," ➤ Matriz Resultado (Procedimento 2)":" ➤ Result Matrix (Procedure 2)",'+  
'"Salvar PDF":"Save PDF","Salvar como PDF":"Save as PDF","Resultado Final":"Final Result",'+
'"Matriz dos Critérios Quantitativos":"Quantitative Criteria Matrix","Matriz das Comparações entre Critérios (Matriz de Saaty)":"Criteria Comparison Matrix (Saaty Matrix)",'+
'"Nova Análise":"New Analysis","Matriz de Desempenho FINAL":"FINAL PERFORMANCE Matrix","Alternativa":"Alternative","Pontuação Obtida":"Score obtained"}');

var currentTab = 0;

setLoadLanguage();

var language = localStorage.getItem("language");

showTab(currentTab);

PopUpProjectName();

function showTab(n) {//MOSTRA A TAB ATUAL E ARRUMA A CONFIGURACAO DOS BOTOES 'PROXIMO' E 'VOLTAR' PARA CADA TAB

    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";

    var nQuant = GetInputsNames(x[1]).length;

    if (n == 0 || n == 2) {//ARRUMA LAYOUT DOS BOTOES
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1) || (nQuant == 1 && n > 1)) {
        (language == "pt-br") ? document.getElementById("nextBtn").innerHTML = "Submter" : document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        (language == "pt-br") ? document.getElementById("nextBtn").innerHTML = "Próximo" : document.getElementById("nextBtn").innerHTML = "Next";
    }
    createQuantInput();
    createCritCompare();

    fixStepIndicator(n)
}

function nextPrev(n) {//ESCOLHE A PROXIMA PAGINA PARA MOSTRAR AO CLICAR EM 'PROXIMO' OU VOLTAR

    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    //QUER CONTINUAR COM ALGO INVALIDO NA TAB DO FORM
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";

    var nQuant = GetInputsNames(x[1]).length;

    if (nQuant == 1 && n == 1 && currentTab == 2) {
        appendParameters();
        document.getElementById("nextBtn").type = "submit";
        document.getElementById("regForm").submit();
        ConfirmationDialog();
        return false;
    }
    else {
        currentTab = currentTab + n;
    }

    if (currentTab >= x.length) {//SE CHEGOU AO FIM DO FORM

        document.getElementById("nextBtn").type = "submit";
        document.getElementById("regForm").submit();
        ConfirmationDialog();
        return false;
    }
    //SENAO MOSTRA A TAB ATUAL
    showTab(currentTab);
}

function validateForm() {//VALIDA OS CRITERIOS DE PREENCHIMENTO DO FORM POR TAB

    var x, y, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");

    var nAlt = GetInputsNames(x[0]).length;
    var nQuant = GetInputsNames(x[1]).length;

    if (currentTab == 0) { //ESCOLHA ALTERNATIVAS--> (N_ALT >=2)

        var EqualPositions = EqualNamesPositions(x[0]);
        var errorEmptyInput = 0;

        for (i = 0; i < y.length; i++) {

            y[i].className = "";
            if (!lettersORNumbers(y[i].value)) {
                y[i].className += " invalid";
                y[i].value = "";
                valid = false;
                errorEmptyInput++;
            }
        }

        for (i = 0; i < EqualPositions.length; i++) {

            y[EqualPositions[i]].className += " invalid";
            valid = false;
        }

        if (errorEmptyInput > 0){
            (language == "pt-br") ? AlertDialog("Todos os campos devem ser preenchidos com pelo menos 1 letra ou número!") : AlertDialog("All fields must be filled with at least 1 letter or number!");
        } else if (nAlt < 2) {
            (language == "pt-br") ? AlertDialog("Devem ser preenchidas pelo menos 2 alternativas!") : AlertDialog("At least 2 alternatives must be filled!");
            valid = false;
        } else if (EqualPositions.length > 0) {
            (language == "pt-br") ? AlertDialog("Os nomes das alternativas devem ser DISTINTOS!") : AlertDialog("Alternative names must be DISTINCT!");
        }

        if (valid)
            document.getElementsByClassName("step")[currentTab].className += " finish";

        return valid;

    } else if (currentTab == 1) { //ESCOLHA CRITERIOS QUANTITATIVOS--> (N_QUANT >=1)

        var EqualPositions = EqualNamesPositions(x[1]);
        var errorEmptyInput = 0;

        for (i = 0; i < y.length; i++) {

            y[i].className = "";
            if (!lettersORNumbers(y[i].value) && nQuant > 0) {
                y[i].className += " invalid";
                y[i].value = "";
                valid = false;
                errorEmptyInput++;
            }
        }

        for (i = 0; i < EqualPositions.length; i++) {

            y[EqualPositions[i]].className += " invalid";
            valid = false;
        }

        if (errorEmptyInput > 0){
            (language == "pt-br") ? AlertDialog("Todos os campos devem ser preenchidos com pelo menos 1 letra ou número!") : AlertDialog("All fields must be filled with at least 1 letter or number!");
        } else if (nQuant > 15 && EqualPositions.length == 0) {
            (language == "pt-br") ? AlertDialog("O número máximo de critérios é 15!") : AlertDialog("The maximum number of criteria is 15!");
            valid = false;
        } else if (EqualPositions.length > 0) {
            (language == "pt-br") ? AlertDialog("Os nomes dos critérios devem ser DISTINTOS!") : AlertDialog("Criterion names must be DISTINCT!");
        } else if (nQuant < 1) {
            (language == "pt-br") ? AlertDialog("Deve ser preenchido pelo menos 1 critério!") : AlertDialog("At least 1 criterion must be filled!");
            valid = false;
        }

        if (valid)
            document.getElementsByClassName("step")[currentTab].className += " finish";

        return valid;

    } else if (currentTab == 2) { //VALORES QUANT--> TUDO DEVE ESTAR PREENCHIDO

        for (i = 0; i < y.length; i++) {

            y[i].className = "";//LIMPA A SELECAO INCORRETA

            if (y[i].value.replaceAll(' ', '') == "" || y[i].value <= 0 || isNaN(y[i].value.replace(',', '.'))) { //CONFERE SE EH UM VALOR NUMERICO
                y[i].className += " invalid";
                y[i].value = "";
                valid = false;
            }
            y[i].value = y[i].value.replace(',', '.');
        }

        if (!valid)
            (language == "pt-br") ? AlertDialog("Todos os campos devem ser preenchidos com valores NUMÉRICOS MAIORES DO QUE 0!") : AlertDialog("All fields must be filled with NUMERIC VALUES GREATER THAN 0!");

        var checkEqual = CheckIfAlternativeValuesAreNotAllQual(y, nAlt, nQuant);

        if (checkEqual[0] != "checked") {

            (language == "pt-br") ? AlertDialog("Os valores das alternativas para um critério não podem ser todos iguais!") : AlertDialog("The values of the alternatives for a criterion cannot all be the same!");

            for (i = 0; i < checkEqual.length; i++) {

                for (j = 0; j < nAlt; j++) {

                    y[checkEqual[i] * (nAlt) + j].className += " invalid";
                }
            }

            valid = false;
        }

        if (valid)
            document.getElementsByClassName("step")[currentTab].className += " finish";//MARCA BOLINHA COMO FEITA

        return valid;

    } else if (currentTab == 3) {

        var cont = 0;

        for (i = 0; i < y.length - 2; i++) {

            if (y[i].value == 0)
                cont++;
        }

        if (cont == y.length - 2) {
            (language == "pt-br") ? AlertDialog("Todos os critérios não podem ser equivalentes!") : AlertDialog("All criteria can`t be equivalent!");
            valid = false;
        }

        if (valid)
            document.getElementsByClassName("step")[currentTab].className += " finish";

        return valid;
    }
}

function fixStepIndicator(n) {//MUDA A COR DA BOLINHA QUE INDICA EM QUE PONTO DO FORM O USUARIO ESTA
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
}

function addAlternative() {//ADICIONA UM CAMPO DE INPUT DE ALTERNATIVA

    var x, y;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");

    var tag = document.createElement('p');
    var inp = document.createElement('input');
    inp.setAttribute('name', 'Alternative' + (y.length));
    (language == "pt-br") ? inp.setAttribute('placeholder', "Nome da alternativa " + (y.length + 1) + "...") : inp.setAttribute('placeholder', "Name of alternative " + (y.length + 1) + "...");
    inp.setAttribute('oninput', "this.className = ''");
    inp.setAttribute('onkeypress', "return tabE(this,event)");
    tag.appendChild(inp);

    var parent = x[currentTab];
    var child = document.getElementById("MoreAlternatives");
    var MoreAltBtnHTML = child.innerHTML;
    parent.removeChild(child);

    var parent = x[currentTab];
    var child = document.getElementById("RemoveItem");
    var RemoveAltBtnHTML = child.innerHTML;
    parent.removeChild(child);

    var btn1 = document.createElement('button');
    btn1.setAttribute('onclick', 'addAlternative()');
    btn1.type = 'button';
    btn1.innerHTML = MoreAltBtnHTML;
    btn1.id = 'MoreAlternatives';

    var btn2 = document.createElement('button');
    btn2.setAttribute('onclick', 'removeInput()');
    btn2.type = 'button';
    btn2.innerHTML = RemoveAltBtnHTML;
    btn2.id = 'RemoveItem';

    parent.appendChild(tag);
    parent.appendChild(btn1);
    parent.appendChild(btn2);
}

function addQuant() {//ADICIONA UM CAMPO DE INPUT DE CRITERIO QUANTITATIVO

    var x, y;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");

    if (y.length < 15) {
        var tag = document.createElement('p');
        var inp = document.createElement('input');
        inp.setAttribute('name', 'CritQuant' + (y.length));
        (language == "pt-br") ? inp.setAttribute('placeholder', "Nome do critério Quant. " + (y.length + 1) + "...") : inp.setAttribute('placeholder', "Name of Quant. criterion " + (y.length + 1) + "...");
        inp.setAttribute('oninput', "this.className = ''");
        inp.setAttribute('onkeypress', "return tabE(this,event)");
        tag.appendChild(inp);

        var parent = x[currentTab];
        var child = document.getElementById("MoreQuant");
        var MoreQuantHTML = child.innerHTML;
        parent.removeChild(child);

        var parent = x[currentTab];
        var child = document.getElementById("RemoveItem2");
        var RemoveQuantHTML = child.innerHTML;
        parent.removeChild(child);

        var btn1 = document.createElement('button');
        btn1.setAttribute('onclick', 'addQuant()');
        btn1.type = 'button';
        btn1.innerHTML = MoreQuantHTML;
        btn1.id = 'MoreQuant';

        var btn2 = document.createElement('button');
        btn2.setAttribute('onclick', 'removeInput()');
        btn2.type = 'button';
        btn2.innerHTML = RemoveQuantHTML;
        btn2.id = 'RemoveItem2';

        parent.appendChild(tag);
        parent.appendChild(btn1);
        parent.appendChild(btn2);
    }
    else {
        (language == "pt-br") ? AlertDialog("O número máximo de critérios é 15") : AlertDialog("The maximum number of criteria is 15");
    }
}

function removeInput() {//REMOVE UM CAMPO DE INPUT DE ALTERNATIVA

    if (currentTab == 0) {

        var x, z;
        x = document.getElementsByClassName("tab");
        z = x[currentTab].getElementsByTagName("p");

        if (z.length < 2) {
            (language == "pt-br") ? AlertDialog("Não é possível remover o campo!") : AlertDialog("It is not possible to remove the field!");
            return;
        }

        x[currentTab].removeChild(z[z.length - 1]);

        var parent = x[currentTab];

        var parent = x[currentTab];
        var child = document.getElementById("RemoveItem");
        var RemoveAltHTML = child.innerHTML;
        parent.removeChild(child);

        var child = document.getElementById("MoreAlternatives");
        var MoreAltHTML = child.innerHTML;
        parent.removeChild(child);

        var btn1 = document.createElement('button');
        btn1.setAttribute('onclick', 'addAlternative()');
        btn1.type = 'button';
        btn1.innerHTML = MoreAltHTML;
        btn1.id = 'MoreAlternatives';

        var btn2 = document.createElement('button');
        btn2.setAttribute('onclick', 'removeInput()');
        btn2.type = 'button';
        btn2.innerHTML = RemoveAltHTML;
        btn2.id = 'RemoveItem';
    }
    else if (currentTab == 1) {

        var x, z;
        x = document.getElementsByClassName("tab");
        z = x[currentTab].getElementsByTagName("p");

        x[currentTab].removeChild(z[z.length - 1]);

        var parent = x[currentTab];

        var parent = x[currentTab];
        var child = document.getElementById("RemoveItem2");
        var RemoveQuantHTML = child.innerHTML;
        parent.removeChild(child);

        var child = document.getElementById("MoreQuant");
        var MoreQuantHTML = child.innerHTML;
        parent.removeChild(child);

        var btn1 = document.createElement('button');
        btn1.setAttribute('onclick', 'addQuant()');
        btn1.type = 'button';
        btn1.innerHTML = MoreQuantHTML;
        btn1.id = 'MoreQuant';

        var btn2 = document.createElement('button');
        btn2.setAttribute('onclick', 'removeInput()');
        btn2.type = 'button';
        btn2.innerHTML = RemoveQuantHTML;
        btn2.id = 'RemoveItem2';
    }

    parent.appendChild(btn1);
    parent.appendChild(btn2);
}

function createQuantInput() {//CRIA A PAGINA HTML ONDE SERAO INPUTADOS OS VALORES QUANTITATIVOS

    if (currentTab == 2 && document.getElementsByClassName("tab")[currentTab].getElementsByTagName("input").length == 0) {

        var x, y, alt, quant;
        x = document.getElementsByClassName("tab");
        y = x[currentTab].getElementsByTagName("input");

        alt = GetInputsNames(x[0]);
        quant = GetInputsNames(x[1]);

        for (var i = 0; i < quant.length; i++) {

            var h2 = document.createElement('h2');
            (language == "pt-br") ? h2.innerHTML = 'Critério : ' + quant[i] : h2.innerHTML = 'Criterion : ' + quant[i];
            x[currentTab].appendChild(h2);

            for (var j = 0; j < alt.length; j++) {

                var div = document.createElement('div');
                div.style = "float:left;margin-right:10px;";

                var lab = document.createElement('label');
                lab.innerHTML = alt[j];

                var inp = document.createElement('input');
                inp.style = "width:150px;margin-top:5px;";
                inp.title = alt[j];
                inp.type = "number";
                inp.setAttribute("onkeyup", "if(this.value<0){this.value= 0}");
                inp.setAttribute('name', "Crit_I_Altern_J" + i + "_" + j);
                inp.setAttribute('onkeypress', "return tabE(this,event)");
                inp.setAttribute('oninput', "this.className = ''");

                div.appendChild(lab);
                div.appendChild(inp);
                x[currentTab].appendChild(div);
            }

            var div = document.createElement('div');
            div.style = "float:left;margin-right:10px;";

            var lab = document.createElement('label');
            (language == "pt-br") ? lab.innerHTML = "Minimizar ou Maximizar?" : lab.innerHTML = "Minimize or Maximze?";

            var sel = document.createElement('select');
            sel.style = "width:150px;margin-top:5px";
            sel.name = "MinMax" + i;
            sel.id = "MinMax" + i;
            sel.required = true;
            var opt1 = document.createElement('option');
            opt1.value = 'Max';
            (language == "pt-br") ? opt1.innerHTML = 'Maximizar ↑': opt1.innerHTML = 'Maximize ↑';
            var opt2 = document.createElement('option');
            opt2.value = 'Min';
            (language == "pt-br") ? opt2.innerHTML = 'Minimizar ↓' : opt2.innerHTML = 'Minimize ↓';

            var br = document.createElement('br');
            br.style = style = "clear:both;";

            sel.appendChild(opt1);
            sel.appendChild(opt2);
            div.appendChild(lab);
            div.appendChild(sel);
            x[currentTab].appendChild(div);
            x[currentTab].appendChild(br);
        }
        scroll(0,0);
    }
}

function createCritCompare() {//CRIA A PAGINA HTML ONDE SERAO INPUTADOS OS VALORES QUALITATIVOS DAS AVALIACOES PARITARIAS ENTRE OS CRITERIOS

    if (currentTab == 3 && document.getElementsByClassName("tab")[currentTab].getElementsByTagName("input").length == 0) {
        var x, quant, alt;
        x = document.getElementsByClassName("tab");

        alt = GetInputsNames(x[0]);
        quant = GetInputsNames(x[1]);

        for (var l = 0; l < quant.length; l++) {

            for (var m = l + 1; m < quant.length; m++) {

                var div1 = document.createElement('div');
                div1.style = "width:100%";

                var div2 = document.createElement('div');
                div2.style = "float:left;margin-right:30px;max-width:700px;";

                var h3 = document.createElement('h3');
                (language == "pt-br") ? h3.innerHTML = "	➤ O quão preferível o critério <b>" + quant[l] + "</b> é em relação a <b>" + quant[m] + "</b>?" : h3.innerHTML = "	➤ How preferable is criterion <b>" + quant[l] + "</b> to <b>" + quant[m] + "</b>?";
                h3.style = "font-weight:200;";
                div2.appendChild(h3);

                var div3 = document.createElement('div');
                div3.setAttribute("class", "range-wrap");

                //termina adição
                var div4 = document.createElement('div');
                div4.setAttribute("class", "value left");
                div4.innerHTML = "-8";
                div3.appendChild(div4);
                //termina adição

                var inp = document.createElement('input');
                inp.setAttribute("type", "range");
                inp.min = "-8";
                inp.max = "8";
                inp.value = "0";
                inp.step = "1";
                inp.setAttribute("class", "range");
                inp.setAttribute('name', "Crit_L_Crit_M" + l + "_" + m);

                var outp = document.createElement('output');
                outp.setAttribute("class", "bubble");

                div3.appendChild(inp);
                div3.appendChild(outp);

                /*inicia adição*/
                var div5 = document.createElement('div');
                div5.setAttribute("class", "value right");
                div5.innerHTML = "8";
                div3.appendChild(div5);
                //termina adição

                div1.appendChild(div2);
                div1.appendChild(div3);
                x[currentTab].appendChild(div1);

                var br = document.createElement('br');
                br.style = style = "clear:both;";
                x[currentTab].appendChild(br);
            }
        }

        SetSliders();

        var nAlt = alt.length;
        var nQ = quant.length;

        var n_Alt = document.createElement('input');
        n_Alt.type = "hidden";
        n_Alt.name = "n_Alt";
        n_Alt.value = nAlt;
        var n_Quant = document.createElement('input');
        n_Quant.type = "hidden";
        n_Quant.name = "n_Quant";
        n_Quant.value = nQ;

        x[currentTab].appendChild(n_Alt);
        x[currentTab].appendChild(n_Quant);

        scroll(0,0);
    }
}

function appendParameters() {

    var x = document.getElementsByClassName("tab");
    var nAlt = GetInputsNames(x[0]).length;
    var nQ = GetInputsNames(x[1]).length;

    var n_Alt = document.createElement('input');
    n_Alt.type = "hidden";
    n_Alt.name = "n_Alt";
    n_Alt.value = nAlt;
    var n_Quant = document.createElement('input');
    n_Quant.type = "hidden";
    n_Quant.name = "n_Quant";
    n_Quant.value = nQ;

    x[currentTab].appendChild(n_Alt);
    x[currentTab].appendChild(n_Quant);
}

function CheckIfAlternativeValuesAreNotAllQual(Inputs, nAlt, nQuant) {//CHECA SE PARA CADA CRITERIO EXISTEM PELO MENOS 2 VALORES DISTINTOS ENTRE OS VALORES DAS ALTERNATIVAS--SE ALGUM CRITERIO TIVER TODAS AS ALTERNATIVAS IGUAIS JAH RETORNA FALSO (ZERA O DENOMINADOR DO MAX MIN)
    //SE OS VALORES DE TODAS AS ALTERNATIVAS PARA UM DADO ATRIBUTO FOREM IGUAIS, ENTAO MAX(aij)=Min(aij) E TEREMOS UMA DIVISAO POR 0 NA NORMALIZACAO "MAXMIN" (AHP-TOPSIS-2N)
    //SE OS VALORES DE TODAS AS ALTERNATIVAS PARA TODOS OS ATRIBUTOS FOREM IGUAIS DENTRO DOS CRITERIOS, AS DISTANCIAS POSITIVAS E NEGATIVAS DAS ALTERNATIVAS (TOPSIS)
    //SERAO COMPOSTAS APENAS DE VALORES = 0, O QUE GERARIA UMA DIVISAO POR 0 ((D+) + (D-)) == 0

    var cont = 0;
    var positions = ["checked"];//ARMAZENA OS INDICES DOS CRITERIOS EM QUE TODOS OS VALORES DAS ALTERNATIVAS SAO IGUAIS

    for (i = 0; i < nQuant; i++) {

        for (j = 0; j < nAlt; j++) {

            for (k = j + 1; k < nAlt; k++) {

                if (Inputs[i * (nAlt) + j].value == Inputs[i * (nAlt) + k].value) {
                    cont++;
                }
            }
        }

        if (cont == (nAlt * (nAlt - 1) / 2)) {//QUANDO O NUMERO DE COMPARACOES QUE DERAM IGUAIS EH IGUAL AO NUMERO DE COMPARACOES FEITAS ==> DENTRO DE CADA CRITERIO OS VALORES DE TODAS AS ALTERNATIVAS SAO IGUAIS 

            if (positions[0] == "checked")
                positions[0] = i;
            else
                positions.push(i);
        }

        cont = 0;
    }

    return positions;
}

function GetInputsNames(Tab) {//RETORNA UM ARRAY COM OS NOMES DOS INPUTS (ALTERNATIVAS, CRI. QUANT, CRIT. QUALIT.) PREENCHIDOS

    var x, elements = [];
    x = Tab.getElementsByTagName("input");

    for (i = 0; i < x.length; i++) {

        if (x[i].value != "")
            elements.push(x[i].value);
    }

    return elements;
}

function EqualNamesPositions(Tab) {//RETORNA UM ARRAY COM AS POSICOES DOS ELEMENTOS QUE TEM NOMES IGUAIS

    var TabInputs = Tab.getElementsByTagName("input");
    var NamesArray = [];

    for (i = 0; i < TabInputs.length; i++) {

        NamesArray.push(TabInputs[i].value);
    }

    var positions = new Array();

    for (i = 0; i < NamesArray.length; i++) {

        for (j = i + 1; j < NamesArray.length; j++) {

            if (String(NamesArray[i]).toUpperCase().replaceAll(' ', '').replaceAll('_', '').replaceAll('.', '').replaceAll(',', '').replaceAll(';', '').replaceAll('/', '').replaceAll('-', '') === String(NamesArray[j]).toUpperCase().replaceAll(' ', '').replaceAll('_', '').replaceAll('.', '').replaceAll(',', '').replaceAll(';', '').replaceAll('/', '').replaceAll('-', '') && NamesArray[i] != "") {

                positions.push(i);
                positions.push(j);
            }
        }
    }

    positions.sort();

    var uniquePositions = [];

    uniquePositions = [...new Set(positions)];//REMOVE DUPLICATAS PQ SET SOH GUARDA VALORES DISTINTOS

    return uniquePositions;
}

function AlertDialog(AlertText){
    
    try{
        Swal.fire({
        title: (language == "pt-br") ? 'Erro!' : 'Error!',
        text: AlertText,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#01346ec2'
      })
    }
    catch{
        alert(AlertText);
    }
}

function ConfirmationDialog(){
        
        Swal.fire({
            icon: 'success',
            title: (language == "pt-br") ? 'Análise submetida com sucesso!' : 'Analysis successfully submitted!',
            showConfirmButton: false,
            timer: 2000
          })
}

function SetSliders() {//MOSTRA VALOR DO SLIDER

    const allRanges = document.getElementsByClassName("range-wrap");

    for (i = 0; i < allRanges.length; i++) {

        const range = allRanges[i].getElementsByClassName("range");
        const bubble = allRanges[i].getElementsByClassName("bubble");

        range[0].addEventListener("input", () => {
            setBubble(range[0], bubble[0]);
        });

        setBubble(range[0], bubble[0]);
    }
}

function setBubble(range, bubble) {//MOSTRA VALOR DO SLIDER
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${11 - newVal * 0.25}px))`;
}

function tabE(obj, e) { //PASSA PARA O PROXIMO ELEMENTO DO FORM AO CLICAR ENTER
    var e = (typeof event != 'undefined') ? window.event : e; // IE : Moz 
    if (e.keyCode == 13) {
        var ele = document.forms[0].elements;
        for (var i = 0; i < ele.length; i++) {
            var q = (i == ele.length - 1) ? 0 : i + 1; // if last element : if any other 
            if (obj == ele[i]) { ele[q].focus(); break }
        }
        return false;
    }
}

function setLoadLanguage() {

	var language = localStorage.getItem('language');

	if (language == "en") {//PTBR TO EN
		var nElem = document.getElementsByClassName('lang').length;
		for (i = 0; i < nElem; i++) {
			var phrase = document.getElementsByClassName('lang')[i];
			document.getElementsByClassName('lang')[i].innerHTML = en[phrase.innerHTML];
        }
        
        document.getElementsByName("Alternative0")[0].setAttribute("placeholder","Name of alternative 1...");
        document.getElementsByName("Alternative1")[0].setAttribute("placeholder","Name of alternative 2...");
        document.getElementsByName("CritQuant0")[0].setAttribute("placeholder","Name of Quant. criterion 1...");
        document.getElementById("SaatyScale").innerHTML = "<text style=\"color: #01346e; font-size:18px; text-align: center;font-style:bold;\">Comparison Scale of X in relation to Y</text><br>"+
        "<text style=\"color: #fff; font-size:16px; text-align: left;font-weight:200;\">"+
        "8: X is of absolute importance over Y."+
         "<br> 6: X is very important or demonstrated over Y."+
         "<br> 4: X is of great or essential importance over Y."+
         "<br> 2: X is of little importance over Y."+
         "<br> 0: Equal importance."+
         "<br> -2: Y is of little importance over X."+
         "<br> -4: Y has great or essential importance over X."+
         "<br> -6: Y is very important or demonstrated over X."+
         "<br> -8: Y has absolute importance over X."+
         "<br> 7, 5, 3, 1, -1, -3, -5, -7: Intermediate Values.</text>";
	}
}

function PopUpProjectName(){//USUARIO FORNECE UM NOME (OBRIGATORIO) PARA A NOVA ANALISE
    try{
    Swal.fire({
        title: (language == "pt-br") ? 'Dê um nome à sua análise' : 'Give your analysis a name',
        input: 'text',
        icon: 'info',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: (language == "pt-br") ? 'Confirmar' : 'Confirm',
        confirmButtonColor: '#01346ec2',
        cancelButtonText: (language == "pt-br") ? 'Voltar à Página Inicial' : 'Go back to Home Page',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed && lettersORNumbers(result.value)) {
          Swal.fire({
            title: result.value,
            icon: 'success'
          })

          localStorage.setItem("Analysis_name",result.value);
          document.getElementById("AnalysisName").value = result.value;
        }
        else if (result.isConfirmed && !lettersORNumbers(result.value)){
            Swal.fire({
                title: (language == "pt-br") ? "Você deve escolher um nome com pelo menos 1 letra ou número para a sua nova análise!" : "You must choose a name with at least 1 letter or number for your new analysis!",
                icon: 'error',
                confirmButtonColor: '#01346ec2',
                confirmButtonText: 'OK'
              }).then((result) => {window.location.href='/3DM/AHP_TOPSIS_2N.html';})
        }
        else{//CLICOU CANCELAR
            window.location.href='/3DM/index.html';
        }
      })
    }
    catch{
    }
}

function lettersORNumbers(string){//CHECA SE A STRING POSSUI PELO MENOS UMA LETRA OU UM NUMERO
    if (/[A-Za-z0-9]/.test(string)) {
      return true;
    }else{
      return false;
    }
 }
 
