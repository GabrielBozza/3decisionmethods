
var en = JSON.parse('{ "Métodos de apoio à decisão":"Decision support methods", "Tutoriais":"Tutorials",'+
' "Leitura complementar":"Further reading","Todos os direitos reservados. O uso não comercial (acadêmico) deste software é gratuito.":"All rights reserved. Non-commercial (academic) use of this software is free.",'+
'"A única coisa que se pede em troca é citar este software quando os resultados são usados em publicações":"The only thing asked in exchange is to cite this software when the results are used in publications",'+
'"Para citar o software:":"To cite the software:","Sobre nós":"About Us","Currículo Lattes":"Lattes Curriculum"}');

var ptbr = JSON.parse('{ "Decision support methods":"Métodos de apoio à decisão","About Us":"Sobre nós", "Tutorials":"Tutoriais", "Further reading":"Leitura complementar","All rights reserved. Non-commercial (academic) use of this software is free.":"Todos os direitos reservados. O uso não comercial (acadêmico) deste software é gratuito.",'+
'"The only thing asked in exchange is to cite this software when the results are used in publications":"A única coisa que se pede em troca é citar este software quando os resultados são usados em publicações",'+
'"To cite the software:":"Para citar o software:"}');

setLoadLanguage();

function setLanguage(lang) {

	if (localStorage.getItem('language') == lang) { return; }
	else {
		localStorage.setItem('language', lang);
		var nElem = document.getElementsByClassName('lang').length;

		for (i = 0; i < nElem; i++) {
			var phrase = document.getElementsByClassName('lang')[i];

			if (lang == "en") {//PTBR TO EN
				document.getElementsByClassName('lang')[i].innerHTML = en[phrase.innerHTML];
			}
			else {//EN TO PTBR
				document.getElementsByClassName('lang')[i].innerHTML = ptbr[phrase.innerHTML];
			}
		}

		if(lang == "en"){
			document.getElementById("AHPTutorialBtn").setAttribute('href',"/3DM/TutorialAHP_EN.html");
			document.getElementById("TOPSISTutorialBtn").setAttribute('href',"/3DM/TutorialTOPSIS_EN.html");
			document.getElementById("AHP_TOPSIS_2NTutorialBtn").setAttribute('href',"/3DM/TutorialAHP_TOPSIS_2N_EN.html");
		}
		else{
			document.getElementById("AHPTutorialBtn").setAttribute('href',"/3DM/TutorialAHP.html");
			document.getElementById("TOPSISTutorialBtn").setAttribute('href',"/3DM/TutorialTOPSIS.html");
			document.getElementById("AHP_TOPSIS_2NTutorialBtn").setAttribute('href',"/3DM/TutorialAHP_TOPSIS_2N.html");
		}
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
		document.getElementById("AHPTutorialBtn").setAttribute('href',"/3DM/TutorialAHP_EN.html");
		document.getElementById("TOPSISTutorialBtn").setAttribute('href',"/3DM/TutorialTOPSIS_EN.html");
		document.getElementById("AHP_TOPSIS_2NTutorialBtn").setAttribute('href',"/3DM/TutorialAHP_TOPSIS_2N_EN.html");
	}
	else{
		localStorage.setItem('language','pt-br');
		document.getElementById("AHPTutorialBtn").setAttribute('href',"/3DM/TutorialAHP.html");
		document.getElementById("TOPSISTutorialBtn").setAttribute('href',"/3DM/TutorialTOPSIS.html");
		document.getElementById("AHP_TOPSIS_2NTutorialBtn").setAttribute('href',"/3DM/TutorialAHP_TOPSIS_2N.html");
	}
}

