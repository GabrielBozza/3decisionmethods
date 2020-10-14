<!DOCTYPE html>
<html lang="pt-BR">

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
	<title class='lang'>RESULTADO TOPSIS</title>
	<link rel="icon" href="img/3dm_icon.ico" type="image/x-icon">
	<link rel="stylesheet" href="style.css">
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
		<h2 style="font-family:Raleway;color:white;" class='lang'>RESULTADO - TOPSIS</h2>
	</div>

	<div id="regForm">

		<!-- <div style="width:100%;text-align:center;font-size:22px;font-weight:600;" id="Analysis_name"></div> -->

		<?php
		include 'functions.php';

		$N_Alt = $_POST["n_Alt"]; //Alt ==> ALTERNATIVES
		$N_Quant = $_POST["n_Quant"]; //NUMBER OF QUANTITATIVE CRITERIA

		$Alt = array();
		ReadAlt($Alt, $N_Alt);

		$CritQuant = array();
		$CritQuantMinMax = array();
		$CritQuantVal = array();
		$SumLinQuant = array();
		$CritQuantValNormal = array();

		$CritQuantWeights = array();
		ReadSquareQuant($CritQuant, $CritQuantMinMax, $CritQuantVal, $SumLinQuant, $CritQuantWeights, $N_Quant, $N_Alt);

		$UtilityMatrix = array();

		$PositiveSolution = array();
		$NegativeSolution = array();

		$PositiveDistance = array();
		$NegativeDistance = array();

		$RelativeProximity = array();

		$ResultMatrix = array();

		try{

			$AnalysisName = $_POST["AnalysisName"];
			echo "<div style=\"width:100%;font-size:22px;font-weight:600;text-align:center;\" id=\"Analysis_name\">".$AnalysisName."</div>";

		} catch(Exception $e){
			echo "<div style=\"width:100%;font-size:22px;font-weight:600;text-align:center;\" id=\"Analysis_name\">TOPSIS</div>";
		}

		// echo "<b>Matriz NÃO normalizada dos critérios QUANTITATIVOS</b> <br><br>";
		// PrintQuantMatrix($CritQuantVal, $CritQuant, $CritQuantMinMax, $N_Quant, $N_Alt);

		NormalizeSquareQuantMatrix($CritQuantValNormal, $CritQuantVal, $SumLinQuant, $N_Quant, $N_Alt);

		// echo "<b>Matriz NORMALIZADA dos critérios QUANTITATIVOS</b> <br><br>";
		// PrintQuantMatrixNormal($CritQuantValNormal, $CritQuant, $N_Quant, $N_Alt);

		MultByWeightMatrix($UtilityMatrix, $CritQuantValNormal, $CritQuantWeights, $N_Quant, $N_Alt);

		// PrintUtilityMatrix($UtilityMatrix, $CritQuant, $N_Quant, $N_Alt);

		CalcIdealSolutions($PositiveSolution, $NegativeSolution,$UtilityMatrix,$CritQuantMinMax,$N_Quant,$N_Alt);

		CalculateDistanceFromIdealSolution($PositiveDistance,$NegativeDistance,$PositiveSolution,$NegativeSolution,$UtilityMatrix,$N_Quant,$N_Alt);

		CalculateRelativeProximity($RelativeProximity,$PositiveDistance,$NegativeDistance,$N_Alt);

		PrintSquareResult($ResultMatrix,$Alt,$RelativeProximity,$PositiveDistance,$NegativeDistance,$N_Alt);

		//PrintQuantMatrix($CritQuantVal, $CritQuant, $CritQuantMinMax, $Alt, $N_Quant, $N_Alt);
		PrintQuantMatrixTOPSIS($CritQuantVal, $CritQuant, $CritQuantWeights, $CritQuantMinMax, $Alt, $N_Quant, $N_Alt);

		?>
		<div style="overflow:auto;">
			<div style="float:right;margin-top:90px;">
				<button id="MORE_INFO" onclick = "MoreInfo()">+</button>
				<button type="button" id="nextBtn" onclick="window.location.href='/3DM/TOPSIS.html'"><text class='lang'>Nova Análise</text></button>
				<button type="button" id="savePDF" onclick="SavePDF()"><text class="lang">Salvar como PDF</text></button>
			</div>
		</div>
	</div>

	<script src="scriptTOPSIS.js"></script>

</body>

<script>

	function SavePDF(){

		var doc = new jsPDF();
		var language = localStorage.getItem("language");
		var Name = document.getElementById("Analysis_name").innerHTML;
		var img = new Image();
		img.src = '/3DM/img/logo_light.png';
		doc.addImage(img, 'png', 93, 10, 26, 20);
		doc.text(20, 40,Name+" (TOPSIS)");
		(language == "pt-br") ? doc.text(20, 50,"Resultado da Normalização") :  doc.text(20, 50,"Normalization Result");
		doc.autoTable({ html: '.NORMALIZED' ,startY: 60,columnStyles: { 0: { fontStyle: 'bold' } }});
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Resultado Final") : doc.text(20, doc.autoTable.previous.finalY + 10,"Final Result");
		doc.autoTable({ html: '.RESULT' ,startY: doc.autoTable.previous.finalY + 15,columnStyles: { 0: { fontStyle: 'bold' } }});
		doc.save(Name+"_TOPSIS"+'.pdf');
	}

	function SaveFullPDF(){

		var doc = new jsPDF();
		var language = localStorage.getItem("language");
		var Name = document.getElementById("Analysis_name").innerHTML;
		var img = new Image();
		img.src = '/3DM/img/logo_light.png';
		doc.addImage(img, 'png', 93, 10, 26, 20);
		doc.text(20, 40,Name+" (TOPSIS)");
		(language == "pt-br") ? doc.text(20, 50,"Resultado da Normalização") :  doc.text(20, 50,"Normalization Result");
		doc.autoTable({ html: '.NORMALIZED' ,startY: 60,columnStyles: { 0: { fontStyle: 'bold' } }});
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Resultado Final") : doc.text(20, doc.autoTable.previous.finalY + 10,"Final Result");
		doc.autoTable({ html: '.RESULT' ,startY: doc.autoTable.previous.finalY + 15,columnStyles: { 0: { fontStyle: 'bold' } }});
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Matriz dos Critérios Quantitativos") : doc.text(20, doc.autoTable.previous.finalY + 10,"Quantitative Criteria Matrix");
		doc.autoTable({ html: '#QUANT_MATRIX' ,startY: doc.autoTable.previous.finalY + 15,columnStyles: { 0: { fontStyle: 'bold' } }});
		doc.save(Name+"_TOPSIS"+'.pdf');
	}t

	function MoreInfo(){

		document.getElementById('QUANT_MATRIX_DIV').style="overflow-x:auto;display:block;";
		document.getElementById('MORE_INFO').innerHTML="-";
		document.getElementById('MORE_INFO').setAttribute("onclick","LessInfo()");
		document.getElementById('savePDF').setAttribute("onclick","SaveFullPDF()");
	}

	function LessInfo(){

		document.getElementById('QUANT_MATRIX_DIV').style="display:none;";
		document.getElementById('MORE_INFO').innerHTML="+";
		document.getElementById('MORE_INFO').setAttribute("onclick","MoreInfo()");
		document.getElementById('savePDF').setAttribute("onclick","SavePDF()");
	}

</script>

</html>