<!DOCTYPE html>
<html lang="pt-BR">

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
	<title class= "lang">RESULTADO - AHP-TOPSIS-2N</title>
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
		<h2 style="font-family:Raleway;color:white;" class= "lang">RESULTADO - AHP-TOPSIS-2N</h2>
	</div>

	<div id="regForm">

		<!-- <div style="width:100%;text-align:center;font-size:22px;font-weight:600;" id="Analysis_name"></div> -->

		<?php
		include 'functions.php';

		$N_Alt = $_POST["n_Alt"]; //Alt ==> ALTERNATIVES
		$N_Quant = $_POST["n_Quant"]; //NUMBER OF QUANTITATIVE CRITERIA

		$Alt = array();

		$CritQuant = array();
		$CritQuantMinMax = array();
		$CritQuantVal = array();
		$SumLinQuant = array();
		$CritQuantValNormalSquare = array();
		$CritQuantValNormalMinMax = array();
		$CritQuantWeights = array();

		$Consistency = "yetToCalculate";
		$ConsistencyRatio = 0;

		$UtilityMatrixSquare = array();
		$UtilityMatrixMinMax = array();

		$PositiveSolutionSquare = array();
		$NegativeSolutionSquare = array();
		$PositiveSolutionMinMax = array();
		$NegativeSolutionMinMax = array();

		$PositiveDistanceSquare = array();
		$NegativeDistanceSquare = array();
		$PositiveDistanceMinMax = array();
		$NegativeDistanceMinMax = array();

		$RelativeProximitySquare = array();
		$RelativeProximityMinMax = array();

		$ResultMatrixSquare = array();
		$ResultMatrixMinMax = array();


		//READ INPUTS AND NORMALIZE MATRIXES
		ReadAlt($Alt, $N_Alt);
		ReadQuantAHP_TOPSIS_2N($CritQuant, $CritQuantMinMax, $CritQuantVal, $SumLinQuant, $N_Quant, $N_Alt);

		NormalizeSquareQuantMatrix($CritQuantValNormalSquare, $CritQuantVal, $SumLinQuant, $N_Quant, $N_Alt);
		NormalizeMinMaxQuantMatrix($CritQuantValNormalMinMax, $CritQuantVal, $N_Quant, $N_Alt);

		ReadCritCompare($CompareCrit, $SumColCompareCrit, 0, $N_Quant);
		NormalizeCritSaatyMatrix($CompareCritNormal, $SumLinCompareCritNormal, $Weights, $CompareCrit, $SumColCompareCrit, 0, $N_Quant);
		SaatyConsistency($Consistency, $ConsistencyRatio, $SumColCompareCrit, $Weights, $N_Quant);

		if ($Consistency != "inconsistent") {

			MultByWeightMatrix($UtilityMatrixSquare, $CritQuantValNormalSquare, $Weights, $N_Quant, $N_Alt);
			MultByWeightMatrix($UtilityMatrixMinMax, $CritQuantValNormalMinMax, $Weights, $N_Quant, $N_Alt);

			CalcIdealSolutions($PositiveSolutionSquare, $NegativeSolutionSquare, $UtilityMatrixSquare, $CritQuantMinMax, $N_Quant, $N_Alt);
			CalcIdealSolutions($PositiveSolutionMinMax, $NegativeSolutionMinMax, $UtilityMatrixMinMax, $CritQuantMinMax, $N_Quant, $N_Alt);

			CalculateDistanceFromIdealSolution($PositiveDistanceSquare, $NegativeDistanceSquare, $PositiveSolutionSquare, $NegativeSolutionSquare, $UtilityMatrixSquare, $N_Quant, $N_Alt);
			CalculateDistanceFromIdealSolution($PositiveDistanceMinMax, $NegativeDistanceMinMax, $PositiveSolutionMinMax, $NegativeSolutionMinMax, $UtilityMatrixMinMax, $N_Quant, $N_Alt);

			CalculateRelativeProximity($RelativeProximitySquare, $PositiveDistanceSquare, $NegativeDistanceSquare, $N_Alt);
			CalculateRelativeProximity($RelativeProximityMinMax, $PositiveDistanceMinMax, $NegativeDistanceMinMax, $N_Alt);

			//PRINT RESULTS

			/*echo "<b>Matriz NÃO normalizada dos critérios QUANTITATIVOS</b> <br><br>";
			PrintQuantMatrix($CritQuantVal, $CritQuant, $CritQuantMinMax, $N_Quant, $N_Alt);

			echo "<b>Matriz NORMALIZADA TOPSIS</b> <br><br>";
			PrintQuantMatrixNormal($CritQuantValNormalSquare, $CritQuant, $N_Quant, $N_Alt);

			echo "<b>Matriz NORMALIZADA MINMAX</b> <br><br>";
			PrintQuantMatrixNormal($CritQuantValNormalMinMax, $CritQuant, $N_Quant, $N_Alt);

			PrintCritSaaty($CompareCrit, 0, $N_Quant);

			echo "<br><b>Matriz de Utilidade TOPSIS</b> <br><br>";
			PrintUtilityMatrix($UtilityMatrixSquare, $CritQuant, $N_Quant, $N_Alt);

			echo "<br><b>Matriz de Utilidade MINMAX</b> <br><br>";
			PrintUtilityMatrix($UtilityMatrixMinMax, $CritQuant, $N_Quant, $N_Alt);*/

			try{

				$AnalysisName = $_POST["AnalysisName"];
				echo "<div style=\"width:100%;font-size:22px;font-weight:600;text-align:center;\" id=\"Analysis_name\">".$AnalysisName."</div>";

			} catch(Exception $e){
				echo "<div style=\"width:100%;font-size:22px;font-weight:600;text-align:center;\" id=\"Analysis_name\">AHP</div>";
			}

			
			echo "<br><b style=\"font-size:18px;\" class=\"lang\"> ➤ Matriz Resultado (Procedimento 1)</b> <br>";			
			PrintSquareResult($ResultMatrixSquare, $Alt, $RelativeProximitySquare, $PositiveDistanceSquare, $NegativeDistanceSquare, $N_Alt);

			echo "<br><b style=\"font-size:18px;\" class=\"lang\"> ➤ Matriz Resultado (Procedimento 2)</b> <br>";
			PrintSquareResult($ResultMatrixMinMax, $Alt, $RelativeProximityMinMax, $PositiveDistanceMinMax, $NegativeDistanceMinMax, $N_Alt);

			PrintQuantMatrix($CritQuantVal, $CritQuant, $CritQuantMinMax, $Alt, $N_Quant, $N_Alt);

			PrintCritSaaty($CompareCrit, 0, $CritQuant, 0, $N_Quant);
		}

		else{

			echo "<br><b class=\"lang\">Erro de consistência</b><br><br>";
			echo "<text class=\"lang\">Consistência da matriz de Saaty dos critérios :</text> " . $Consistency . "<br>";
		}

		?>
		<div style="overflow:auto;">
			<div style="float:right;">
				<button id="MORE_INFO" onclick = "MoreInfo()">+</button>
				<button type="button" id="nextBtn" onclick="window.location.href='/3DM/AHP_TOPSIS_2N.html'"><text class="lang">Nova Análise</text></button>
				<button type="button" id="savePDF" onclick="SavePDF()"><text class="lang">Salvar como PDF</text></button>
			</div>
		</div>
	</div>

	<script src="scriptAHP_TOPSIS_2N.js"></script>

</body>

<script>

	function SavePDF(){
		var matrixes = document.getElementsByClassName('NORMALIZED');
		matrixes[0].setAttribute("id","NormalizedSquare");
		matrixes[1].setAttribute("id","NormalizedMinMax");

		var Rmatrixes = document.getElementsByClassName('RESULT');
		Rmatrixes[0].setAttribute("id","ResultSquare");
		Rmatrixes[1].setAttribute("id","ResultMinMax");

		var doc = new jsPDF();
		var language = localStorage.getItem("language");
		var Name = document.getElementById("Analysis_name").innerHTML;
		var img = new Image();
		img.src = '/3DM/img/logo_light.png';
		doc.addImage(img, 'png', 93, 10, 26, 20);
		doc.text(20, 40,Name+" (AHP-TOPSIS-2N)");
		(language == "pt-br") ? doc.text(20, 50,"Resultado da Normalização - Procedimento 1") :  doc.text(20, 50,"Normalization Result - Procedure 1");
		doc.autoTable({ html: '#NormalizedSquare' ,startY: 60,columnStyles: { 0: { fontStyle: 'bold' } }});
		doc.autoTable({ html: '#ResultSquare' ,startY: doc.autoTable.previous.finalY + 15,columnStyles: { 0: { fontStyle: 'bold' } }});
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Resultado da Normalização - Procedimento 2") : doc.text(20, doc.autoTable.previous.finalY + 10,"Normalization Result - Procedure 2");
		doc.autoTable({ html: '#NormalizedMinMax' ,startY: doc.autoTable.previous.finalY + 15,columnStyles: { 0: { fontStyle: 'bold' } }});
		doc.autoTable({ html: '#ResultMinMax' ,startY: doc.autoTable.previous.finalY + 15,columnStyles: { 0: { fontStyle: 'bold' } }});
		doc.save(Name+"_AHP_TOPSIS_2N"+'.pdf');
	}

	function SaveFullPDF(){
		var matrixes = document.getElementsByClassName('NORMALIZED');
		matrixes[0].setAttribute("id","NormalizedSquare");
		matrixes[1].setAttribute("id","NormalizedMinMax");

		var Rmatrixes = document.getElementsByClassName('RESULT');
		Rmatrixes[0].setAttribute("id","ResultSquare");
		Rmatrixes[1].setAttribute("id","ResultMinMax");

		var doc = new jsPDF();
		var language = localStorage.getItem("language");
		var Name = document.getElementById("Analysis_name").innerHTML;
		var img = new Image();
		img.src = '/3DM/img/logo_light.png';
		doc.addImage(img, 'png', 93, 10, 26, 20);
		doc.text(20, 40,Name+" (AHP-TOPSIS-2N)");
		(language == "pt-br") ? doc.text(20, 50,"Resultado da Normalização - Procedimento 1") :  doc.text(20, 50,"Normalization Result - Procedure 1");
		doc.autoTable({ html: '#NormalizedSquare' ,startY: 60,columnStyles: { 0: { fontStyle: 'bold' } }});
		doc.autoTable({ html: '#ResultSquare' ,startY: doc.autoTable.previous.finalY + 15,columnStyles: { 0: { fontStyle: 'bold' } }});
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Resultado da Normalização - Procedimento 2") : doc.text(20, doc.autoTable.previous.finalY + 10,"Normalization Result - Procedure 2");
		doc.autoTable({ html: '#NormalizedMinMax' ,startY: doc.autoTable.previous.finalY + 15,columnStyles: { 0: { fontStyle: 'bold' } }});
		doc.autoTable({ html: '#ResultMinMax' ,startY: doc.autoTable.previous.finalY + 15,columnStyles: { 0: { fontStyle: 'bold' } }});
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Matriz dos Critérios Quantitativos") : doc.text(20, doc.autoTable.previous.finalY + 10,"Quantitative Criteria Matrix");	
		doc.autoTable({ html: '#QUANT_MATRIX',startY: doc.autoTable.previous.finalY + 15,
			columnStyles: { 0: { fontStyle: 'bold' } } });	
		(language == "pt-br") ? doc.text(20, doc.autoTable.previous.finalY + 10,"Matriz das comparações entre os Critérios (Matriz de Saaty)") : doc.text(20, doc.autoTable.previous.finalY + 10,"Criteria comparison Matrix (Saaty Matrix)");	
		doc.autoTable({ html: '#CRIT_SAATY',startY: doc.autoTable.previous.finalY + 15,
			columnStyles: { 0: { fontStyle: 'bold' } } });	
		doc.save(Name+"_AHP_TOPSIS_2N"+'.pdf');
	}

	function MoreInfo(){

		document.getElementById('QUANT_MATRIX_DIV').style="overflow-x:auto;display:block;";
		document.getElementById('CRIT_SAATY_DIV').style="overflow-x:auto;display:block;";
		document.getElementById('MORE_INFO').innerHTML="-";
		document.getElementById('MORE_INFO').setAttribute("onclick","LessInfo()");
		document.getElementById('savePDF').setAttribute("onclick","SaveFullPDF()");
	}

	function LessInfo(){

		document.getElementById('QUANT_MATRIX_DIV').style="display:none;";
		document.getElementById('CRIT_SAATY_DIV').style="display:none;";
		document.getElementById('MORE_INFO').innerHTML="+";
		document.getElementById('MORE_INFO').setAttribute("onclick","MoreInfo()");
		document.getElementById('savePDF').setAttribute("onclick","SavePDF()");
	}
</script>

</html>