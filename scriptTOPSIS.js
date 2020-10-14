var en = JSON.parse('{ "Método TOPSIS":"TOPSIS Method", "Registro das alternativas:":"Registration of alternatives", "Alternativas:":"Alternatives:", "+ Adicionar alternativa":"+ Add alternative", "- Remover alternativa":"- Remove alternative" ,"Registro dos critérios Quantitativos:" : "Record of Quantitative criteria:",' +
	'"Critérios QUANTITATIVOS:" : "QUANTITATIVE criteria:",' +
	'"+ Adicionar critério" : "+ Add criterion",' +
	'"- Remover critério" : "- Remove criterion",' +
	'"Valores dos critérios Quantitativos:" : "Quantitative criteria values:",' +
	'"Peso:" : "Weight:","RESULTADO TOPSIS":"TOPSIS RESULT",' +
	'"Anterior" : "Previous","Próximo" : "Next","RESULTADO - TOPSIS":"RESULT - TOPSIS","Erro de consistência":"Consistency error",' +
	'"Consistência de":"Consistency of","Consistência da matriz de Saaty dos critérios :":"Consistency of the criteria Saaty matrix :",' +
	'"D+ : Distância para a solução ideal positiva.":"D +: Distance to the ideal positive solution.","D- : Distância para a solução ideal negativa.":"D-: Distance to the ideal negative solution.","RS : Proximidade relativa.":"RS: Relative proximity.",' +
	'"Salvar PDF":"Save PDF","Salvar como PDF":"Save as PDF","Peso":"Weight",' +
	'"Matriz dos Critérios Quantitativos":"Quantitative Criteria Matrix","Resultado Final":"Final Result",'+
	'"Nova Análise":"New Analysis","Alternativa":"Alternative","Pontuação Obtida":"Score obtained"}');

var currentTab = 0;

setLoadLanguage();

var language = localStorage.getItem("language");

showTab(currentTab);

PopUpProjectName();

function showTab(n) {//MOSTRA A TAB ATUAL E ARRUMA A CONFIGURACAO DOS BOTOES 'PROXIMO' E 'VOLTAR' PARA CADA TAB

	var x = document.getElementsByClassName("tab");
	x[n].style.display = "block";

	if (n == 0 || n == 2) {//ARRUMA LAYOUT DOS BOTOES
		document.getElementById("prevBtn").style.display = "none";
	} else {
		document.getElementById("prevBtn").style.display = "inline";
	}
	if (n == (x.length - 1)) {
		(language == "pt-br") ? document.getElementById("nextBtn").innerHTML = "Submter" : document.getElementById("nextBtn").innerHTML = "Submit";
	} else {
		(language == "pt-br") ? document.getElementById("nextBtn").innerHTML = "Próximo" : document.getElementById("nextBtn").innerHTML = "Next";
	}
	createQuantInput();

	fixStepIndicator(n)
}

function nextPrev(n) {//ESCOLHE A PROXIMA PAGINA PARA MOSTRAR AO CLICAR EM 'PROXIMO' OU VOLTAR

	// This function will figure out which tab to display
	var x = document.getElementsByClassName("tab");
	//QUER CONTINUAR COM ALGO INVALIDO NA TAB DO FORM
	if (n == 1 && !validateForm()) return false;
	// Hide the current tab:
	x[currentTab].style.display = "none";

	currentTab = currentTab + n;

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

	var x, y, totalPeso = 0, valid = true;
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

		if (errorEmptyInput > 0) {
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

		if (errorEmptyInput > 0) {
			(language == "pt-br") ? AlertDialog("Todos os campos devem ser preenchidos com pelo menos 1 letra ou número!") : AlertDialog("All fields must be filled with at least 1 letter or number!");
		} else if (EqualPositions.length > 0) {
			(language == "pt-br") ? AlertDialog("Os nomes dos critérios devem ser DISTINTOS!") : AlertDialog("Criterion names must be DISTINCT!");
		} else if (nQuant == 0) {
			(language == "pt-br") ? AlertDialog("Deve ser preenchido pelo menos 1 critério!") : AlertDialog("At least 1 criterion must be filled!");
			valid = false;
		}

		if (valid)
			document.getElementsByClassName("step")[currentTab].className += " finish";

		return valid;

	} else if (currentTab == 2) { //VALORES QUANT--> TUDO DEVE ESTAR PREENCHIDO

		var errorValNum = 0, errorWeight0 = 0, errorWeightSum = 0, errorAllValEqual = 0;

		for (i = 0; i < y.length; i++) {

			y[i].className = "";//LIMPA A SELECAO INCORRETA

			if (y[i].value.replaceAll(' ', '') == "" || y[i].value <= 0 || isNaN(y[i].value.replace(',', '.'))) { //CONFERE SE EH UM VALOR NUMERICO
				y[i].className += " invalid";
				y[i].value = "";
				valid = false;
				errorValNum++;
			}
			y[i].value = y[i].value.replace(',', '.');
		}

		for (i = nAlt; i < y.length; i += (nAlt + 1)) {

			totalPeso += parseFloat(y[i].value);

			if (y[i].value == 0) {

				y[i].className += " invalid";
				valid = false;
				errorWeight0++;
			}
		}

		//totalPeso = Math.round((totalPeso + 0.00001) * 100) / 100;//VER SE SERVE ARREDONDAR ASSIM!!!!!!!!!!!!!!!!

		if (totalPeso != 1) {

			for (i = nAlt; i < y.length; i += (nAlt + 1)) {

				y[i].className += " invalid";
			}
			valid = false;
			errorWeightSum++;
		}

		if (!CheckIfAlternativeValuesAreNotAllQual(y, nAlt, nQuant)) {

			errorAllValEqual++;

			for (i = 0; i < nQuant; i++) {

				for (j = 0; j < nAlt + 1; j++) {

					if (j == nAlt)//PULA INPUT DO PESO DO CRITERIO
						break;
					y[i * (nAlt + 1) + j].className += " invalid";
				}
			}

			valid = false;
		}

		if (valid)
			document.getElementsByClassName("step")[currentTab].className += " finish";//MARCA BOLINHA COMO FEITA
		else {

			var ErrorText = "<div style='text-align:justify;'>";

			if (errorValNum != 0)
				(language == "pt-br") ? ErrorText += "➤Todos os campos devem ser preenchidos com valores numéricos e maiores que 0!<br/>" : ErrorText += "➤All fields must be filled with NUMERIC VALUES GREATER THAN 0!<br/>";
			if (errorWeight0 != 0) {
				(language == "pt-br") ? ErrorText += "➤Os valores dos pesos devem ser maiores que 0 e menores ou iguais a 1!<br/>" : ErrorText += "➤Weight values must be greater than 0 and less or equal than 1!<br/>";
			}
			if (errorWeightSum != 0) {
				(language == "pt-br") ? ErrorText += "➤A soma dos pesos deve ser igual a 1!<br/>" : ErrorText += "➤Weight sum must be equal to 1!<br/>";
			}
			if (errorAllValEqual != 0) {
				(language == "pt-br") ? ErrorText += "➤Os valores das alternativas para um dado critério não podem ser todos iguais para todos os critérios!<br/>" : ErrorText += "➤The values of the alternatives for a given criterion cannot all be the same for all criteria!<br/>";
			}

			ErrorText += "</div>";

			AlertDialog(ErrorText);
		}
		return valid;
	}
}

function fixStepIndicator(n) {//MUDA A COR DA BOLINHA QUE INDICA EM QUE PONTO DO FORM O USUARIO ESTA

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
	} else if (currentTab == 1) {

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

	/*<h2 id="c1">Critério 1:</h2>
	
	<div style="float:left;margin-right:10px;">
		<label>Segurança</label>
		<input style="width:150px;margin-top:5px;title:Segurança" oninput="this.className = ''"  onkeypress="return tabE(this,event)">
	</div>
	
	<div style="float:left;margin-right:10px;">
		<label>Preço</label>
		<input style="width:150px;margin-top:5px;title:Preço" oninput="this.className = ''" onkeypress="return tabE(this,event)">
	</div>
	
	<div style="float:left;margin-right:10px;">
		<label>Desempenho</label>
		<input style="width:150px;margin-top:5px;title:Desempenho" oninput="this.className = ''" onkeypress="return tabE(this,event)">
	</div>

	<div style="float:left;margin-right:10px;">
		<label>Peso: </label>
		<input style="width:150px;margin-top:5px;title:Desempenho" oninput="this.className = ''" onkeypress="return tabE(this,event)">
	</div>
	
	<div style="float:left;margin-right:10px;">
		<label>Minimizar ou Maximizar?</label>
		<select style="width:150px;margin-top:5px" id="MinMax1" name="MinMax1">
				<option value="Max">Maximizar ↑</option>
				<option value="Min">Minimizar ↓</option>
		</select>
	</div>
	  
	<br style="clear:both;" />*/

	if (currentTab == 2 && document.getElementsByClassName("tab")[currentTab].getElementsByTagName("input").length == 0) {

		var x, alt, quant;
		x = document.getElementsByClassName("tab");

		alt = GetInputsNames(x[0]);
		quant = GetInputsNames(x[1]);

		for (var i = 0; i < quant.length; i++) {//PARA CADA CRITÉRIO QUANT

			var h2 = document.createElement('h2');
			(language == "pt-br") ? h2.innerHTML = 'Critério : ' + quant[i] : h2.innerHTML = 'Criterion : ' + quant[i];
			x[currentTab].appendChild(h2);

			for (var j = 0; j < alt.length; j++) {//PARA CADA ALTERNATIVA

				var div = document.createElement('div');
				div.style = "float:left;margin-right:10px;";

				var lab = document.createElement('label');
				lab.innerHTML = alt[j];

				var inp = document.createElement('input');
				inp.type = "number";
				inp.setAttribute("onkeyup", "if(this.value<0){this.value= 0}");
				inp.setAttribute('name', "Crit_I_Altern_J" + i + "_" + j);
				inp.setAttribute('onkeypress', "return tabE(this,event)");
				inp.setAttribute('oninput', "this.className = ''");
				inp.style = "width:150px;margin-top:5px;";
				inp.title = alt[j];

				div.appendChild(lab);
				div.appendChild(inp);
				x[currentTab].appendChild(div);
			}

			if (i == quant.length - 1) {
				var div1 = document.createElement('div');
				div1.style = "float:left;margin-right:10px;";

				var divWeight = document.createElement('div');
				divWeight.style = "width:100%;";

				var lab = document.createElement('label');
				(language == "pt-br") ? lab.innerHTML = "Peso:" : lab.innerHTML = "Weight:";
				lab.style = "margin-left:20px";

				var inp = document.createElement('input');
				inp.type = "number";
				inp.setAttribute('name', "Weight" + i);
				inp.setAttribute('onkeypress', "return tabE(this,event)");
				inp.setAttribute('oninput', "this.className = ''");
				inp.setAttribute("onkeyup", "if(this.value<0  || this.value>1){this.value= 0}");
				inp.setAttribute("onchange", "WeightSum()");
				inp.setAttribute("step", "0.0001");
				inp.style = "width:150px;margin-top:5px;margin-left:20px;";

				divWeight.appendChild(lab);
				divWeight.appendChild(inp);

				var divWeightSum = document.createElement('div');
				divWeightSum.style = "height:40px;width:100%;margin-top:20px;font-color:white;";

				var txt = document.createElement("text");
				txt.style = "height:100%;margin-left:20px;color:white;font-weight:600;background-color:#01346ec2;border-radius:5px;padding:10px 15px;";
				(language == "pt-br") ? txt.innerHTML = "Soma: 0" : txt.innerHTML = "Sum: 0";
				txt.setAttribute("id", "WeightSum");

				var tooltip = document.createElement("div");
				tooltip.setAttribute("Class", "tooltip");
				tooltip.innerHTML = '<i style="color:#01346ec2;font-size:16px;" class="fa fa-fw fa-info-circle"></i>'
				tooltip.style = "margin-right:10px";
				var span = document.createElement("span");
				span.setAttribute("Class", "tooltiptext2");
				var txttooltip = document.createElement("text");
				txttooltip.style = "color: #fff; font-size:16px; text-align: left";
				(language == "pt-br") ? txttooltip.innerHTML = "A soma dos pesos deve ser igual a 1" : txttooltip.innerHTML = "Weight sum must be equal to 1"

				span.appendChild(txttooltip);
				tooltip.appendChild(span);

				divWeightSum.appendChild(txt);

				divWeightSum.appendChild(tooltip);
				div1.appendChild(divWeight);
				div1.appendChild(divWeightSum);
				//div1.appendChild(tooltip);

				x[currentTab].appendChild(div1);

			}
			else {
				var divWeight = document.createElement('div');
				divWeight.style = "float:left;margin-right:10px;";

				var lab = document.createElement('label');
				(language == "pt-br") ? lab.innerHTML = "Peso:" : lab.innerHTML = "Weight:";
				lab.style = "margin-left:20px";

				var inp = document.createElement('input');
				inp.type = "number";
				inp.setAttribute('name', "Weight" + i);
				inp.setAttribute('onkeypress', "return tabE(this,event)");
				inp.setAttribute('oninput', "this.className = ''");
				inp.setAttribute("onkeyup", "if(this.value<0  || this.value>1){this.value= 0}");
				inp.setAttribute("onchange", "WeightSum()");
				inp.setAttribute("step", "0.0001");
				inp.style = "width:150px;margin-top:5px;margin-left:20px;";

				divWeight.appendChild(lab);
				divWeight.appendChild(inp);

				x[currentTab].appendChild(divWeight);
			}

			var div = document.createElement('div');
			div.style = "float:left;margin-right:10px;";

			var lab2 = document.createElement('label');
			(language == "pt-br") ? lab2.innerHTML = "Minimizar ou Maximizar?" : lab2.innerHTML = "Minimize or Maximze?";

			var sel = document.createElement('select');
			sel.style = "width:150px;margin-top:5px";
			sel.name = "MinMax" + i;
			sel.id = "MinMax" + i;
			var opt1 = document.createElement('option');
			opt1.value = 'Max';
			(language == "pt-br") ? opt1.innerHTML = 'Maximizar ↑' : opt1.innerHTML = 'Maximize ↑';
			var opt2 = document.createElement('option');
			opt2.value = 'Min';
			(language == "pt-br") ? opt2.innerHTML = 'Minimizar ↓' : opt2.innerHTML = 'Minimize ↓';

			var br = document.createElement('br');
			br.style = style = "clear:both;";

			sel.appendChild(opt1);
			sel.appendChild(opt2);
			div.appendChild(lab2);
			div.appendChild(sel);

			x[currentTab].appendChild(div);
			x[currentTab].appendChild(br);
		}

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

		scroll(0, 0);
	}
}

function CheckIfAlternativeValuesAreNotAllQual(Inputs, nAlt, nQuant) {//CHECA SE PARA CADA CRITERIO EXISTEM PELO MENOS 2 VALORES DISTINTOS ENTRE OS VALORES DAS ALTERNATIVAS
	//SE OS VALORES DE TODAS AS ALTERNATIVAS PARA UM DADO ATRIBUTO FOREM IGUAIS, ENTAO MAX(aij)=Min(aij) E TEREMOS UMA DIVISAO POR 0 NA NORMALIZACAO "MAXMIN" (AHP-TOPSIS-2N)
	//SE OS VALORES DE TODAS AS ALTERNATIVAS PARA TODOS OS ATRIBUTOS FOREM IGUAIS DENTRO DOS CRITERIOS, AS DISTANCIAS POSITIVAS E NEGATIVAS DAS ALTERNATIVAS (TOPSIS)
	//SERAO COMPOSTAS APENAS DE VALORES = 0, O QUE GERARIA UMA DIVISAO POR 0 ((D+) + (D-)) == 0

	var cont = 0;

	for (i = 0; i < nQuant; i++) {

		for (j = 0; j < nAlt + 1; j++) {

			for (k = j + 1; k < nAlt + 1; k++) {

				if (Inputs[i * (nAlt + 1) + j].value == Inputs[i * (nAlt + 1) + k].value) {
					cont++;
				}
				if (k == nAlt - 1)//PULA INPUT DO PESO DO CRITERIO
					break;
			}

			if (j == nAlt - 2)//PULA INPUT DO PESO DO CRITERIO
				break;
		}
	}

	if (cont == nQuant * (nAlt * (nAlt - 1) / 2))//QUANDO O NUMERO DE COMPARACOES QUE DERAM IGUAIS EH IGUAL AO NUMMERO DE COMPARACOES FEITAS ==> DENTRO DE CADA CRITERIO OS VALORES DE TODAS AS ALTERNATIVAS SAO IGUAIS 
		return false;
	else
		return true;
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

function AlertDialog(AlertText) {
	try {
		Swal.fire({
			title: (language == "pt-br") ? 'Erro!' : 'Error!',
			html: AlertText,
			icon: 'error',
			confirmButtonText: 'OK',
			confirmButtonColor: '#01346ec2',
			textalign: 'start'
		})
	}
	catch {
		alert(String(AlertText).replace('<div style=\'text-align:justify;\'>', '').replace('</div>', '').replaceAll('<br/>', '\n'));
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

function WeightSum() {

	var weightSum = document.getElementById("WeightSum");
	var nAlt = GetInputsNames(document.getElementsByClassName("tab")[0]);
	var nQuant = GetInputsNames(document.getElementsByClassName("tab")[1]);
	var Sum = 0;

	for (i = 0; i < nQuant.length; i++) {

		var inp = document.getElementsByClassName("tab")[2].getElementsByTagName("input")[((nAlt.length) * (i + 1)) + (i)];
		(!isNaN(parseFloat(inp.value.replace(',', '.'))) && parseFloat(inp.value.replace(',', '.')) < 0) ? inp.value = 0 : inp.value = inp.value;
		Sum += isNaN(parseFloat(inp.value.replace(',', '.'))) ? 0 : parseFloat(inp.value.replace(',', '.'));
	}

	if (Sum > 1 && parseFloat(String(weightSum.innerHTML).substring(6, weightSum.innerHTML.length)) <= 1) {
		weightSum.style = "height:100%;margin-left:20px;color:white;font-weight:600;background-color:#ce0606;border-radius:5px;padding:10px 15px;";
		(language == "pt-br") ? AlertDialog("A soma dos pesos deve ser igual a 1!") : AlertDialog("Weight sum must be equal to 1!");
	}
	else if (Sum > 1 && parseFloat(String(weightSum.innerHTML).substring(6, weightSum.innerHTML.length)) > 1) {
		weightSum.style = "height:100%;margin-left:20px;color:white;font-weight:600;background-color:#ce0606;border-radius:5px;padding:10px 15px;";
	}
	else if (Sum == 1) {
		weightSum.style = "height:100%;margin-left:20px;color:white;font-weight:600;background-color:#00de7a;border-radius:5px;padding:10px 15px;";
	}

	else {
		weightSum.style = "height:100%;margin-left:20px;color:white;font-weight:600;background-color:#01346ec2;border-radius:5px;padding:10px 15px;";
	}

	var SumTxt = (language == "pt-br") ? "Soma: " : "Sum: ";
	weightSum.innerHTML = SumTxt + Math.round((Sum + 0.00001) * 10000) / 10000;
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

		document.getElementsByName("Alternative0")[0].setAttribute("placeholder", "Name of alternative 1...");
		document.getElementsByName("Alternative1")[0].setAttribute("placeholder", "Name of alternative 2...");
		document.getElementsByName("CritQuant0")[0].setAttribute("placeholder", "Name of Quant. criterion 1...");
	}
}

function PopUpProjectName() {//USUARIO FORNECE UM NOME (OBRIGATORIO) PARA A NOVA ANALISE
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

			localStorage.setItem("Analysis_name", result.value);
			document.getElementById("AnalysisName").value = result.value;
		}
		else if (result.isConfirmed && !lettersORNumbers(result.value)) {
			Swal.fire({
				title: (language == "pt-br") ? "Você deve escolher um nome com pelo menos 1 letra ou número para a sua nova análise!" : "You must choose a name with at least 1 letter or number for your new analysis!",
				icon: 'error',
				confirmButtonColor: '#01346ec2',
				confirmButtonText: 'OK'
			}).then((result) => { window.location.href = '/3DM/TOPSIS.html'; })
		}
		else {//CLICOU CANCELAR
			window.location.href = '/3DM/index.html';
		}
	})
}catch{
}

}

function lettersORNumbers(string) {//CHECA SE A STRING POSSUI PELO MENOS UMA LETRA OU UM NUMERO
	if (/[A-Za-z0-9]/.test(string)) {
		return true;
	} else {
		return false;
	}
}

