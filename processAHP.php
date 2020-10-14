<!DOCTYPE html>
<html lang="pt-BR">

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
	<title class="lang">Método AHP</title>
	<link rel="stylesheet" href="style.css">
	<link rel="icon" href="img/3dm_icon.ico" type="image/x-icon">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
</head>

<body>

  <script>
    document.body.style.zoom = (window.screen.width/1536);
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.6/jspdf.plugin.autotable.min.js"></script>

	<div class="topnav">
		<button onclick="window.location.href='/3DM/index.html'" style="float:left;height:60px;font-size:25px;background-color:#01346ec2;"><i class="fa fa-fw fa-home"></i></button>
		<h2 style="font-family:Raleway;color:white;" class="lang">RESULTADO - AHP</h2>
	</div>

	<div id="regForm" style="padding-bottom:50px;">

		<!-- <div style="width:100%;font-size:22px;font-weight:600;text-align:center;" id="Analysis_name"></div> -->

		<?php

		include 'functions.php';

		//echo phpinfo();

		$N_Alt = $_POST["n_Alt"]; //Alt ==> ALTERNATIVES
		$N_Quant = $_POST["n_Quant"]; //NUMBER OF QUANTITATIVE CRITERIA
		$N_Qualit = $_POST["n_Qualit"]; //NUMBER OF QUALITATIVE CRITERIA

		$Alt = array();

		$CritQuant = array();
		$CritQuantMinMax = array();
		$CritQuantVal = array();
		$SumLinQuant = array();
		$CritQuantValNormal = array();

		$CritQualit = array();
		$SomaColQualit = array();
		$CritQualitVal = array();

		$SumLinQualitNormal = array();
		$MeanQualitNormal = array(); //MEDIA = $SumLinQualitNormal[$i][$j]/$N_Alt
		$CritQualitValNormal = array();

		$CompareCrit = array();
		$SumColCompareCrit = array();

		$CompareCritNormal = array();
		$SumLinCompareCritNormal = array();
		$Weights =  array();

		$ConsistencyQualit = array();
		$ConsistencyRatioQualit = array();

		$Consistency = "yetToCalculate";
		$ConsistencyRatio = 0;

		$FinalMatrix = array();
		$Result = array();

		ReadAlt($Alt, $N_Alt);
		ReadQuant($CritQuant, $CritQuantMinMax, $CritQuantVal, $SumLinQuant, $N_Quant, $N_Alt);

		NormalizeQuantMatrix($CritQuantValNormal, $CritQuantVal, $SumLinQuant, $N_Quant, $N_Alt);

		ReadQualit($CritQualit, $CritQualitVal, $N_Qualit, $N_Alt);
		NormalizeQualitMatrixes($CritQualitValNormal, $SumLinQualitNormal, $SomaColQualit, $MeanQualitNormal, $ConsistencyQualit, $ConsistencyRatioQualit, $CritQualitVal, $N_Qualit, $N_Alt);

		ReadCritCompare($CompareCrit, $SumColCompareCrit, $N_Qualit, $N_Quant);
		NormalizeCritSaatyMatrix($CompareCritNormal, $SumLinCompareCritNormal, $Weights, $CompareCrit, $SumColCompareCrit, $N_Qualit, $N_Quant);
		SaatyConsistency($Consistency, $ConsistencyRatio, $SumColCompareCrit, $Weights, ($N_Quant + $N_Qualit));
		
		$cont = 0;
		
		for ($i = 0; $i < $N_Qualit; $i++) {

			if($ConsistencyQualit[$i] == "inconsistent")
				$cont++;
		}

		if ($cont == 0 && $Consistency != "inconsistent") {

			try{

				$AnalysisName = $_POST["AnalysisName"];
				echo "<div style=\"width:100%;font-size:22px;font-weight:600;text-align:center;\" id=\"Analysis_name\">".$AnalysisName."</div>";

			} catch(Exception $e){
				echo "<div style=\"width:100%;font-size:22px;font-weight:600;text-align:center;\" id=\"Analysis_name\">AHP</div>";
			}

			CreateFinalMatrix($FinalMatrix, $MeanQualitNormal, $CritQuantValNormal, $Weights, $N_Qualit, $N_Quant, $N_Alt);
			CalculateResult($Result, $FinalMatrix, $Alt, $N_Qualit, $N_Quant, $N_Alt);

			echo "<div style=\"width:100%;\">";
			echo "<div style=\"width:100%;\">";
			PrintFinalMatrix($FinalMatrix, $CritQuant, $CritQualit, $Result ,$N_Qualit, $N_Quant, $N_Alt);
			echo "</div>";

			echo "<div style=\"\">";
			echo "<br><b> ➤ <text style=\"font-size:18px;\" class=\"lang\">Resultado Final</text></b>";
			PrintResult($Result,$N_Alt);
			echo "</div>";
			echo "</div>";

			//echo "<b>Matriz NÃO normalizada dos critérios QUANTITATIVOS</b> <br><br>";
			PrintQuantMatrix($CritQuantVal, $CritQuant, $CritQuantMinMax, $Alt, $N_Quant, $N_Alt);//ID=QUANT_MATRIX

			//echo "<b>Matriz NORMALIZADA dos critérios QUANTITATIVOS</b> <br><br>";
			//PrintQuantMatrixNormal($CritQuantValNormal, $CritQuant, $N_Quant, $N_Alt);//ID=QUANT_MATRIX_NORMAL

			PrintQualitMatrixes($CritQualit, $CritQualitVal, $Alt, $N_Qualit, $N_Alt);//ID=QUALIT_MATRIXES

			//PrintNormalizedQualitMatrixes($CritQualit, $CritQualitValNormal, $MeanQualitNormal, $N_Qualit, $N_Alt);//ID=NORMALIZED_QUALIT_MATRIXES

			//echo "<br> <b>Matriz de Desempenho Antes de mult pelos pesos</b> <br><br>";
			//PrintFinalMatrixBeforeWeight($CritQuantValNormal, $CritQuant, $CritQualit, $MeanQualitNormal, $N_Quant, $N_Qualit, $N_Alt);

			PrintCritSaaty($CompareCrit,$CritQualit, $CritQuant, $N_Qualit, $N_Quant);//CRIT_SAATY

			//PrintCritSaatyNormal($CompareCritNormal, $Weights, $N_Qualit, $N_Quant);

		} else {

			echo "<br><b class=\"lang\">Erro de consistência</b><br><br>";
			for ($i = 0; $i < $N_Qualit; $i++) {

				echo "<text class=\"lang\">Consistência de</text> " . $CritQualit[$i] . " : " . $ConsistencyQualit[$i] . "<br>";
			}

			echo "<text class=\"lang\">Consistência da matriz de Saaty dos critérios :</text> " . $Consistency . "<br>";
		}
		?>
		<div style="overflow:auto;">
			<div style="float:right;margin-top:90px;">
				<button id="MORE_INFO" onclick = "MoreInfo()">+</button>
				<button type="button" id="nextBtn" onclick="window.location.href='/3DM/AHP.html'"><text class="lang">Nova Análise</text></button>
				<button type="button" id="savePDF" onclick="SavePDF()"><text class="lang">Salvar como PDF</text></button>
			</div>
		</div>
	</div>

</body>
<script src="scriptAHP.js"></script>

<script>
	
	function SavePDF(){
		var doc = new jsPDF();
		var language = localStorage.getItem("language");
		var Name = document.getElementById("Analysis_name").innerHTML;
		var img = new Image();
		img.src = '/3DM/img/logo_light.png';
		doc.addImage(img, 'png', 93, 10, 26, 20);
		doc.text(20, 40,Name+" (AHP)");//PROBLEMA===>MOSTRA EM PAGINAS DISTINTAS
		doc.autoTable({ html: '.RESULT' , startY: 50, columnStyles: { 0: { fontStyle: 'bold' } }});
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Matriz de Desempenho Final") : doc.text(20, doc.autoTable.previous.finalY + 10,"Final Performance Matrix");
		doc.autoTable({ html: '#FinalMatrix',startY: doc.autoTable.previous.finalY + 15,
			columnStyles: { 0: { fontStyle: 'bold' } } });
		doc.save(Name+"_AHP"+'.pdf');
	}

	function SaveFullPDF(){
		var doc = new jsPDF();
		var language = localStorage.getItem("language");
		var Name = document.getElementById("Analysis_name").innerHTML;
		var QualitMatrixes = document.getElementsByClassName('QUALIT_MATRIXES');
		var img = new Image();
		img.src = '/3DM/img/logo_light.png';
		doc.addImage(img, 'png', 93, 10, 26, 20);
		doc.text(20, 40,Name+" (AHP)");
		doc.autoTable({ html: '.RESULT' , startY: 50, columnStyles: { 0: { fontStyle: 'bold' } }});
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Matriz de Desempenho Final") : doc.text(20, doc.autoTable.previous.finalY + 10,"Final Performance Matrix");
		doc.autoTable({ html: '#FinalMatrix',startY: doc.autoTable.previous.finalY + 15,
			columnStyles: { 0: { fontStyle: 'bold' } } });
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Matriz dos Critérios Quantitativos") : doc.text(20, doc.autoTable.previous.finalY + 10,"Quantitative Criteria Matrix");	
		doc.autoTable({ html: '#QUANT_MATRIX',startY: doc.autoTable.previous.finalY + 15,
			columnStyles: { 0: { fontStyle: 'bold' } } });	
				
		for(i=0;i<QualitMatrixes.length;i++){
			(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,QualitMatrixes[i].getAttribute('title') + "(Critério Qualitativo)") : doc.text(20, doc.autoTable.previous.finalY + 10,QualitMatrixes[i].getAttribute('title') + "(Qualitative Criterion)");
			doc.autoTable({ html: QualitMatrixes[i],startY: doc.autoTable.previous.finalY + 15,
			columnStyles: { 0: { fontStyle: 'bold' } } });
		}
		
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Matriz das comparações entre os Critérios (Matriz de Saaty)") : doc.text(20, doc.autoTable.previous.finalY + 10,"Criteria comparison Matrix (Saaty Matrix)");	
		doc.autoTable({ html: '#CRIT_SAATY',startY: doc.autoTable.previous.finalY + 15,
			columnStyles: { 0: { fontStyle: 'bold' } } });		
		doc.save(Name+"_AHP"+'.pdf');
	}

	function MoreInfo(){

		document.getElementById('QUANT_MATRIX_DIV').style="overflow-x:auto;display:block;";
		document.getElementById('QUALIT_MATRIXES_DIV').style="overflow-x:auto;display:block;";
		document.getElementById('CRIT_SAATY_DIV').style="overflow-x:auto;display:block;";
		document.getElementById('MORE_INFO').innerHTML="-";
		document.getElementById('MORE_INFO').setAttribute("onclick","LessInfo()");
		document.getElementById('savePDF').setAttribute("onclick","SaveFullPDF()");

	}

	function LessInfo(){

		document.getElementById('QUANT_MATRIX_DIV').style="display:none;";
		document.getElementById('QUALIT_MATRIXES_DIV').style="display:none;";
		document.getElementById('CRIT_SAATY_DIV').style="display:none;";
		document.getElementById('MORE_INFO').innerHTML="+";
		document.getElementById('MORE_INFO').setAttribute("onclick","MoreInfo()");
		document.getElementById('savePDF').setAttribute("onclick","SavePDF()");

	}

</script>

</html>