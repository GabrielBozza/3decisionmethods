<?php

function ReadAlt(&$Alt, $N_Alt)
{

	for ($i = 0; $i < $N_Alt; $i++) {

		$Alt[] = $_POST["Alternative" . $i];
	}
}

function ReadQuant(&$CritQuant, &$CritQuantMinMax, &$CritQuantVal, &$SumLinQuant, $N_Quant, $N_Alt)
{

	for ($i = 0; $i < $N_Quant; $i++) {

		$CritQuant[] = $_POST["CritQuant" . $i];
		$CritQuantMinMax[] = $_POST["MinMax" . $i];
		$SumLinQuant[$i] = 0;

		for ($j = 0; $j < $N_Alt; $j++) { //SE UM CRITERIO FOR DO TIPO MIN (DEVE SER MINIMIZADO) ==> FAZER 1/VALOR

			$CritQuantVal[$i][$j] = ($CritQuantMinMax[$i] == "Max") ? $_POST["Crit_I_Altern_J" . $i . "_" . $j] : 1 / $_POST["Crit_I_Altern_J" . $i . "_" . $j];
			$SumLinQuant[$i] += $CritQuantVal[$i][$j];
		}
	}
}

function ReadSquareQuant(&$CritQuant, &$CritQuantMinMax, &$CritQuantVal, &$SumLinQuant, &$CritQuantWeights, $N_Quant, $N_Alt)
{

	for ($i = 0; $i < $N_Quant; $i++) {

		$CritQuant[] = $_POST["CritQuant" . $i];
		$CritQuantWeights[] = $_POST["Weight" . $i];
		$CritQuantMinMax[] = $_POST["MinMax" . $i];
		$SumLinQuant[$i] = 0;

		for ($j = 0; $j < $N_Alt; $j++) {

			$CritQuantVal[$i][$j] = $_POST["Crit_I_Altern_J" . $i . "_" . $j];
			$SumLinQuant[$i] += $CritQuantVal[$i][$j] * $CritQuantVal[$i][$j];
		}
	}
}

function ReadQuantAHP_TOPSIS_2N(&$CritQuant, &$CritQuantMinMax, &$CritQuantVal, &$SumLinQuant, $N_Quant, $N_Alt)
{

	for ($i = 0; $i < $N_Quant; $i++) {

		$CritQuant[] = $_POST["CritQuant" . $i];
		$CritQuantMinMax[] = $_POST["MinMax" . $i];
		$SumLinQuant[$i] = 0;

		for ($j = 0; $j < $N_Alt; $j++) { //SE UM CRITERIO FOR DO TIPO MIN (DEVE SER MINIMIZADO) ==> FAZER 1/VALOR

			$CritQuantVal[$i][$j] = $_POST["Crit_I_Altern_J" . $i . "_" . $j];
			$SumLinQuant[$i] += $CritQuantVal[$i][$j] * $CritQuantVal[$i][$j];
		}
	}
}

function ReadQualit(&$CritQualit, &$CritQualitVal, $N_Qualit, $N_Alt)
{

	for ($i = 0; $i < $N_Qualit; $i++) {

		$CritQualit[$i] = $_POST["CritQualit" . $i];

		for ($j = 0; $j < $N_Alt; $j++) {

			$CritQualitVal[$i][$j][$j] = 1;

			for ($k = $j + 1; $k < $N_Alt; $k++) { //RESULTADO DO SLIDER MAPEADO --> -8=1/9; 0=1 ; 8=9

				$CritQualitVal[$i][$j][$k] = ($_POST["Crit_I_Altern_J_Altern_K" . $i . "_" . $j . "_" . $k] >= 0) ? $_POST["Crit_I_Altern_J_Altern_K" . $i . "_" . $j . "_" . $k] + 1 : (-1 / ($_POST["Crit_I_Altern_J_Altern_K" . $i . "_" . $j . "_" . $k] - 1));
				$CritQualitVal[$i][$k][$j] = 1 / $CritQualitVal[$i][$j][$k];
			}
		}
	}
}

function ReadCritCompare(&$CompareCrit, &$SumColCompareCrit, $N_Qualit, $N_Quant)
{

	for ($i = 0; $i < $N_Qualit; $i++) { // PRIMEIRO QUALIT COM RESTO DOS QUALIT, DEPOIS TODOS OS QUANT/..../ULTIMO QUALIT COM RESTO DOS QUALIT(NENHUM), DEPOIS TODOS OS QUANT / PRIMEIRO DO QUANT COM O RESTO DOS QUANT/..../TODAS AS COMB SOH COM QUANT 

		$CompareCrit[$i][$i] = 1; //DIAG. PRINCIPAL

		for ($j = $i + 1; $j < $N_Qualit; $j++) { //RESTO DOS CRIT. QUALITATIVOS

			$CompareCrit[$i][$j] = ($_POST["Crit_I_Crit_J" . $i . "_" . $j] >= 0) ? $_POST["Crit_I_Crit_J" . $i . "_" . $j] + 1 : (-1 / ($_POST["Crit_I_Crit_J" . $i . "_" . $j] - 1));
			$CompareCrit[$j][$i] = 1 / $CompareCrit[$i][$j];
		}

		for ($k = 0; $k < $N_Quant; $k++) { //TODOS OS CRIT. QUANTITATIVOS

			$CompareCrit[$i][($k + $N_Qualit)] = ($_POST["Crit_I_Crit_K" . $i . "_" . $k] >= 0) ? $_POST["Crit_I_Crit_K" . $i . "_" . $k] + 1 : (-1 / ($_POST["Crit_I_Crit_K" . $i . "_" . $k] - 1));
			$CompareCrit[($k + $N_Qualit)][$i] = 1 / $CompareCrit[$i][($k + $N_Qualit)];
		}
	}

	for ($l = 0; $l < $N_Quant; $l++) { //COMBINAÇÕES ENTRE OS CRIT. QUANT

		$CompareCrit[($l + $N_Qualit)][($l + $N_Qualit)] = 1; //DIAG. PRINCIPAL

		for ($m = $l + 1; $m < $N_Quant; $m++) {

			$CompareCrit[($l + $N_Qualit)][($m + $N_Qualit)] = ($_POST["Crit_L_Crit_M" . $l . "_" . $m] >= 0) ? $_POST["Crit_L_Crit_M" . $l . "_" . $m] + 1 : (-1 / ($_POST["Crit_L_Crit_M" . $l . "_" . $m] - 1));
			$CompareCrit[($m + $N_Qualit)][($l + $N_Qualit)] = 1 / $CompareCrit[($l + $N_Qualit)][($m + $N_Qualit)];
		}
	}

	for ($i = 0; $i < $N_Qualit + $N_Quant; $i++) {

		$SumColCompareCrit[$i] = 0;

		for ($j = 0; $j < $N_Qualit + $N_Quant; $j++) {

			$SumColCompareCrit[$i] += $CompareCrit[$j][$i]; //SALVA SOMA DAS COLUNAS PARA NORMALIZAR A MATRIZ DEPOIS
		}
	}
}

function PrintQuantMatrix($CritQuantVal, $CritQuant, $CritQuantMinMax, $Alt, $N_Quant, $N_Alt)//OK
{

	echo "<br><div id=\"QUANT_MATRIX_DIV\" style=\"display:none;text-align:center;font-size:18px;\"><b style=\"font-size:18px;\">  ➤ <text class=\"lang\">Matriz dos Critérios Quantitativos</text></b><table id=\"QUANT_MATRIX\" >";
	echo "<tr><th></th>";

	for ($i = 0; $i < $N_Alt; $i++) {
		echo "<th>".$Alt[$i] . "</th>";
	}
	
	echo "<th>Max/Min</th></tr>";

	for ($i = 0; $i < $N_Quant; $i++) {

		echo "<tr><th>".$CritQuant[$i] . "</th>";

		for ($j = 0; $j < $N_Alt; $j++) {
		    
		    if($CritQuantMinMax[$i]=="Min"){
		        echo "<td>".number_format((float)(1/$CritQuantVal[$i][$j]), 4, '.', '') ."</td>";
		    }
		    else{
		        echo "<td>".number_format((float)$CritQuantVal[$i][$j], 4, '.', '') ."</td>";   
		    }
		}

		echo "<td>".$CritQuantMinMax[$i] . "</td></tr>";
	}
	echo "</table></div>";
}

function PrintQuantMatrixTOPSIS($CritQuantVal, $CritQuant, $CritQuantWeights ,$CritQuantMinMax, $Alt, $N_Quant, $N_Alt)//OK
{

	echo "<br><div id=\"QUANT_MATRIX_DIV\" style=\"display:none;text-align:center;font-size:18px;\"><b style=\"font-size:18px;\">  ➤ <text class=\"lang\">Matriz dos Critérios Quantitativos</text></b><table id=\"QUANT_MATRIX\" >";
	echo "<tr><th></th>";

	for ($i = 0; $i < $N_Alt; $i++) {
		echo "<th>".$Alt[$i] . "</th>";
	}
	
	echo "<th class=\"lang\">Peso</th><th>Max/Min</th></tr>";

	for ($i = 0; $i < $N_Quant; $i++) {

		echo "<tr><th>".$CritQuant[$i] . "</th>";

		for ($j = 0; $j < $N_Alt; $j++) {

			echo "<td>".number_format((float)$CritQuantVal[$i][$j], 4, '.', '') ."</td>";
		}

		echo "<td>".$CritQuantWeights[$i] . "</td>";
		echo "<td>".$CritQuantMinMax[$i] . "</td></tr>";
	}
	echo "</table></div>";
}


function NormalizeQuantMatrix(&$CritQuantValNormal, $CritQuantVal, $SumLinQuant, $N_Quant, $N_Alt)
{

	for ($i = 0; $i < $N_Quant; $i++) {

		for ($j = 0; $j < $N_Alt; $j++) {

			$CritQuantValNormal[$i][$j] = $CritQuantVal[$i][$j] / $SumLinQuant[$i];
		}
	}
}

function NormalizeSquareQuantMatrix(&$CritQuantValNormal, $CritQuantVal, $SumLinQuant, $N_Quant, $N_Alt)
{

	for ($i = 0; $i < $N_Quant; $i++) {

		for ($j = 0; $j < $N_Alt; $j++) {

			$CritQuantValNormal[$i][$j] = $CritQuantVal[$i][$j] / sqrt($SumLinQuant[$i]);
		}
	}
}

function NormalizeMinMaxQuantMatrix(&$CritQuantValNormalMinMax, $CritQuantVal, $N_Quant, $N_Alt)
{

	$Aux = array();

	for ($i = 0; $i < $N_Quant; $i++) {

		for ($j = 0; $j < $N_Alt; $j++) {

			$Aux[$j] = $CritQuantVal[$i][$j];
		}

		$Min = min($Aux);
		$Max = max($Aux);

		for ($j = 0; $j < $N_Alt; $j++) {

			$CritQuantValNormalMinMax[$i][$j] = ($CritQuantVal[$i][$j] - $Min) / ($Max - $Min);
		}
	}
}

function PrintQuantMatrixNormal($CritQuantValNormal, $CritQuant, $N_Quant, $N_Alt)
{

	echo "<div id=\"QUANT_MATRIX_NORMAL\"  style=\"display:none;\">";
	for ($i = 0; $i < $N_Quant; $i++) {

		echo $CritQuant[$i] . " | ";

		for ($j = 0; $j < $N_Alt; $j++) {

			echo number_format((float)$CritQuantValNormal[$i][$j], 4, '.', '') . " | ";
		}
		echo "<br>";
	}
	echo "<br></div>";
}

function PrintQualitMatrixes($CritQualit, $CritQualitVal, $Alt, $N_Qualit, $N_Alt)//OK
{

	echo "<div id=\"QUALIT_MATRIXES_DIV\" style=\"display:none;text-align:center;\">";

	for ($i = 0; $i < $N_Qualit; $i++) {

		echo "<b style=\"font-size:18px;\"> ➤ " . $CritQualit[$i] . " </b><text style=\"font-size:18px;\" class=\"lang\">(Critério Qualitativo)</text>";

		echo "<table class=\"QUALIT_MATRIXES\" title=\"".$CritQualit[$i]."\"><tr><th></th>";

		for ($l = 0; $l < $N_Alt; $l++) {
			echo "<th>".$Alt[$l] . "</th>";
		}

		echo "</tr>";

		for ($j = 0; $j < $N_Alt; $j++) {

			echo "<tr><th>".$Alt[$j]."</th>";

			for ($k = 0; $k < $N_Alt; $k++) {

				echo "<td>".number_format((float)$CritQualitVal[$i][$j][$k], 4, '.', '') ."</td>";
			}
			echo "</tr>";
		}
		echo "</table><br>";
	}
	echo "</div>";
}

function NormalizeQualitMatrixes(&$CritQualitValNormal, &$SumLinQualitNormal, &$SomaColQualit, &$MeanQualitNormal, &$ConsistencyQualit, &$ConsistencyRatioQualit, $CritQualitVal, $N_Qualit, $N_Alt)
{

	for ($i = 0; $i < $N_Qualit; $i++) {

		for ($j = 0; $j < $N_Alt; $j++) {

			$SomaColQualit[$i][$j] = 0;

			for ($k = 0; $k < $N_Alt; $k++) {

				$SomaColQualit[$i][$j] += $CritQualitVal[$i][$k][$j]; //GUARDA A SOMA DOS VALORES DAS COLUNAS
			}
		}
	}

	for ($i = 0; $i < $N_Qualit; $i++) {

		for ($j = 0; $j < $N_Alt; $j++) {

			$SumLinQualitNormal[$i][$j] = 0;

			for ($k = 0; $k < $N_Alt; $k++) {

				$CritQualitValNormal[$i][$j][$k] = $CritQualitVal[$i][$j][$k] / $SomaColQualit[$i][$k];
				$SumLinQualitNormal[$i][$j] +=  $CritQualitValNormal[$i][$j][$k];
			}

			$MeanQualitNormal[$i][$j] = $SumLinQualitNormal[$i][$j] / $N_Alt; //MEDIA DO CRITERIO QUALITATIVO I, LINHA J (NORMALIZADO)
		}

		SaatyConsistency($Consistency, $ConsistencyRatio, $SomaColQualit[$i], $MeanQualitNormal[$i], $N_Alt);
		$ConsistencyQualit[$i] = $Consistency;
		$ConsistencyRatioQualit[$i] = $ConsistencyRatio;
	}
}

function PrintNormalizedQualitMatrixes($CritQualit, $CritQualitValNormal, $MeanQualitNormal, $N_Qualit, $N_Alt)
{
	echo "<div id=\"NORMALIZED_QUALIT_MATRIXES\" style=\"display:none;\">";
	for ($i = 0; $i < $N_Qualit; $i++) {

		echo "<br> <b>Matriz NORMALIZADA do critério QUALITATIVO " . $CritQualit[$i] . "</b><br>";

		for ($j = 0; $j < $N_Alt; $j++) {

			for ($k = 0; $k < $N_Alt; $k++) {

				echo number_format((float) $CritQualitValNormal[$i][$j][$k], 4, '.', '') . " | ";
			}

			echo " Média ==> " . number_format((float)$MeanQualitNormal[$i][$j], 4, '.', '') . "<br>";
		}
	}
	echo "</div>";
}

function PrintNormalizedQualitMean($CritQualit, $MeanQualitNormal, $N_Qualit, $N_Alt)
{

	echo "<div id=\"NORMALIZED_QUALIT_MEAN\" style=\"display:none;\">";
	for ($i = 0; $i < $N_Qualit; $i++) { //IMPRIME AS PRIMEIRAS LINHAS DA MATRIZ DE DESEMPENHO ANTES DE MULT. PELOS PESOS

		echo $CritQualit[$i] . " | ";

		for ($j = 0; $j < $N_Alt; $j++) {

			echo number_format((float)$MeanQualitNormal[$i][$j], 4, '.', '') . " | ";
		}
		echo "<br>";
	}
	echo "</div>";
}

function PrintFinalMatrixBeforeWeight($CritQuantValNormal, $CritQuant, $CritQualit, $MeanQualitNormal, $N_Quant, $N_Qualit, $N_Alt)
{

	PrintNormalizedQualitMean($CritQualit, $MeanQualitNormal, $N_Qualit, $N_Alt); //PRIMEIRAS LINHAS SAO OS CRITÉRIOS QUALITATIVOS
	PrintQuantMatrixNormal($CritQuantValNormal, $CritQuant, $N_Quant, $N_Alt); //ÚLTIMAS LINHAS SÃO OS CRITÉRIOS QUALITATIVOS
}

function PrintCritSaaty($CompareCrit, $CritQualit, $CritQuant , $N_Qualit, $N_Quant)
{
	echo "<div id=\"CRIT_SAATY_DIV\" style=\"display:none;\">";
	echo "<br> <b> ➤ </b><b class = \"lang\" style=\"font-size:18px;\">Matriz das Comparações entre Critérios (Matriz de Saaty)</b> <br><br>";

	echo "<table id=\"CRIT_SAATY\"><tr><th></th>";

	for ($i = 0; $i < $N_Qualit; $i++) {
		echo "<th>".$CritQualit[$i]."</th>";
	}

	for ($i = 0; $i < $N_Quant; $i++) {
		echo "<th>".$CritQuant[$i]."</th>";
	}

	echo "</tr>";

	for ($i = 0; $i < $N_Qualit + $N_Quant; $i++) {

		echo "<tr>";

		if($i<$N_Qualit){
			echo "<th>".$CritQualit[$i]."</th>";
		}
		else{
			echo "<th>".$CritQuant[$i-$N_Qualit]."</th>";
		}

		for ($j = 0; $j < $N_Qualit + $N_Quant; $j++) {

			echo "<td>".number_format((float)$CompareCrit[$i][$j], 2, '.', '') . "</td>";
		}
		echo '</tr>';
	}
	echo "</table></div>";
}

function NormalizeCritSaatyMatrix(&$CompareCritNormal, &$SumLinCompareCritNormal, &$Weights, $CompareCrit, $SumColCompareCrit, $N_Qualit, $N_Quant)
{

	for ($i = 0; $i < $N_Qualit + $N_Quant; $i++) {

		$SumLinCompareCritNormal[$i] = 0;

		for ($j = 0; $j < $N_Qualit + $N_Quant; $j++) {

			$CompareCritNormal[$i][$j] = $CompareCrit[$i][$j] / $SumColCompareCrit[$j];
			$SumLinCompareCritNormal[$i] += $CompareCritNormal[$i][$j]; //SALVA SOMA DAS LINHAS PARA FAZER A MÉDIA DEPOIS
		}
	}

	for ($i = 0; $i < $N_Qualit + $N_Quant; $i++) { //GERA ARRAY DE PESOS DOS CRITÉRIOS

		$Weights[$i] = $SumLinCompareCritNormal[$i] / ($N_Qualit + $N_Quant); //PESO = MÉDIA SIMPLES
	}
}

function SaatyConsistency(&$Consistency, &$ConsistencyRatio, $SumCol, $Weights, $N_Elem)
{

	$Sum = 0;

	for ($i = 0; $i < $N_Elem; $i++) {

		$Sum += $SumCol[$i] * $Weights[$i];
	}

	if ($N_Elem != 1)
		$ConsistencyIndex = ($Sum - $N_Elem) / ($N_Elem - 1); //ConsistencyIndex É O LAMBDA

	switch ($N_Elem) { //RANDOM INDEX DETERMINATION
		case 1:
		case 2:
			$Consistency = "great";
			$RandomicIndex = 0;
			break;
		case 3:
			$RandomicIndex = 0.58;
			break;
		case 4:
			$RandomicIndex = 0.9;
			break;
		case 5:
			$RandomicIndex = 1.12;
			break;
		case 6:
			$RandomicIndex = 1.24;
			break;
		case 7:
			$RandomicIndex = 1.32;
			break;
		case 8:
			$RandomicIndex = 1.41;
			break;
		case 9:
			$RandomicIndex = 1.45;
			break;
		case 10:
			$RandomicIndex = 1.49;
			break;
		case 11:
			$RandomicIndex = 1.51;
			break;
		case 12:
			$RandomicIndex = 1.48;
			break;
		case 13:
			$RandomicIndex = 1.56;
			break;
		case 14:
			$RandomicIndex = 1.57;
			break;
		case 15:
			$RandomicIndex = 1.59;
			break;
	}

	if ($N_Elem > 2) {
		
		$ConsistencyRatio = $ConsistencyIndex / $RandomicIndex;

		if ($ConsistencyRatio < 0.1 && $ConsistencyRatio > 0) //Consistencia Otima
			$Consistency = "great";
		else if ($ConsistencyRatio >= 0.1 && $ConsistencyRatio < 0.2) //Consistencia Aceitavel
			$Consistency = "acceptable";
		else if ($ConsistencyRatio >= 0.2) //INCONSISTENTE
			$Consistency = "inconsistent";
	}
}

function PrintCritSaatyNormal($CompareCritNormal, $Weights, $N_Qualit, $N_Quant)
{

	echo "<div id=\CRIT_SAATY_NORMAL\" style=\"display:none;\">";
	echo "<br> <b>Matriz de Saaty NORMALIZADA dos Critérios</b> <br><br>";

	for ($i = 0; $i < $N_Qualit + $N_Quant; $i++) {

		for ($j = 0; $j < $N_Qualit + $N_Quant; $j++) {

			echo number_format((float)$CompareCritNormal[$i][$j], 4, '.', '') . " | ";
		}
		echo " Peso ==> " . number_format((float)$Weights[$i], 4, '.', '') . "<br>";
	}
	echo "</div>";
}

function CreateFinalMatrix(&$FinalMatrix, $MeanQualitNormal, $CritQuantValNormal, $Weights, $N_Qualit, $N_Quant, $N_Alt)
{

	for ($i = 0; $i < $N_Qualit + $N_Quant; $i++) { //PRIMEIRAS LINHAS SAO TODOS OS CRITERIOS QUALITATIVOS

		for ($j = 0; $j < $N_Alt; $j++) {

			if ($i < $N_Qualit)
				$FinalMatrix[$i][$j] = $MeanQualitNormal[$i][$j] * $Weights[$i]; //I J
			else
				$FinalMatrix[$i][$j] = $CritQuantValNormal[$i - $N_Qualit][$j] * $Weights[$i];
		}
	}
}

function MultByWeightMatrix(&$UtilityMatrix, $CritQuantValNormal, $CritQuantWeights, $N_Quant, $N_Alt)
{

	for ($i = 0; $i < $N_Quant; $i++) {

		for ($j = 0; $j < $N_Alt; $j++) {

			$UtilityMatrix[$i][$j] = $CritQuantValNormal[$i][$j] * $CritQuantWeights[$i];
		}
	}
}

function PrintUtilityMatrix($UtilityMatrix, $CritQuant, $N_Quant, $N_Alt)
{

	for ($i = 0; $i < $N_Quant; $i++) { //PRIMEIRAS LINHAS SAO TODOS OS CRITERIOS QUALITATIVOS

		echo $CritQuant[$i] . " | ";

		for ($j = 0; $j < $N_Alt; $j++) {

			echo number_format((float)$UtilityMatrix[$i][$j], 4, '.', '') . " | "; //I J
		}
		echo "<br>";
	}
	echo "<br>";
}

function PrintFinalMatrix($FinalMatrix, $CritQuant, $CritQualit, $Result ,$N_Qualit, $N_Quant, $N_Alt)
{

	echo "<br><br> <b> ➤ </b><b style=\"font-size:18px;\" class=\"lang\">Matriz de Desempenho Final</b> <br>";

	echo "<div style=\"overflow-x:auto;\"><table id=\"FinalMatrix\"> <tr>";//COLOCAR ALTERNATIVAS NA PRIMEIRA LINHA

	echo "<th></th>";

	for($i=0;$i<$N_Alt;$i++){

		echo "<th>".$Result[$i][1]."</th>";
	}

	echo "</tr>";

	for ($i = 0; $i < $N_Qualit + $N_Quant; $i++) { //PRIMEIRAS LINHAS SAO TODOS OS CRITERIOS QUALITATIVOS

		if ($i < $N_Qualit)
			echo "<tr><th>".$CritQualit[$i]. "</th>";
		else
			echo "<tr><th>".$CritQuant[$i - $N_Qualit]. "</th>";

		for ($j = 0; $j < $N_Alt; $j++) {

			echo "<td>".number_format((float)$FinalMatrix[$i][$j], 4, '.', '')."</td>"; //I J
		}
		echo "</tr>";
	}
	echo "<tr><th>Total</th>";
	for($i=0;$i<$N_Alt;$i++){

		echo "<td>".number_format((float)$Result[$i][0], 4, '.', '')."</td>";
	}
	echo "</tr></table></div>";
}

function CalcIdealSolutions(&$PositiveSolution, &$NegativeSolution, $UtilityMatrix, $CritQuantMinMax, $N_Quant, $N_Alt)
{

	$Aux = array();

	for ($i = 0; $i < $N_Quant; $i++) {

		for ($j = 0; $j < $N_Alt; $j++) {

			$Aux[$j] = $UtilityMatrix[$i][$j];
		}

		if ($CritQuantMinMax[$i] == "Min") {

			$PositiveSolution[$i] = min($Aux);
			$NegativeSolution[$i] = max($Aux);
		} else {

			$PositiveSolution[$i] = max($Aux);
			$NegativeSolution[$i] = min($Aux);
		}

		//echo ($i+1)." ".$PositiveSolution[$i]." ".$NegativeSolution[$i]."<br>";
	}
}

function CalculateDistanceFromIdealSolution(&$PositiveDistance, &$NegativeDistance, $PositiveSolution, $NegativeSolution, $UtilityMatrix, $N_Quant, $N_Alt)
{

	for ($j = 0; $j < $N_Alt; $j++) {

		$PositiveDistance[$j] = 0;
		$NegativeDistance[$j] = 0;

		for ($i = 0; $i < $N_Quant; $i++) {

			$PositiveDistance[$j] += ($UtilityMatrix[$i][$j] - $PositiveSolution[$i]) * ($UtilityMatrix[$i][$j] - $PositiveSolution[$i]);
			$NegativeDistance[$j] += ($UtilityMatrix[$i][$j] - $NegativeSolution[$i]) * ($UtilityMatrix[$i][$j] - $NegativeSolution[$i]);
		}

		$PositiveDistance[$j] =  sqrt($PositiveDistance[$j]);
		$NegativeDistance[$j] = sqrt($NegativeDistance[$j]);

		//echo ($j+1)." ".$PositiveDistance[$j]." ".$NegativeDistance[$j]."<br>";
	}
}

function CalculateRelativeProximity(&$RelativeProximity, $PositiveDistance, $NegativeDistance, $N_Alt)
{

	for ($i = 0; $i < $N_Alt; $i++) {

		$RelativeProximity[$i] = $NegativeDistance[$i] / ($PositiveDistance[$i] + $NegativeDistance[$i]);
	}
}

function CalculateResult(&$Result, $FinalMatrix, $Alt, $N_Qualit, $N_Quant, $N_Alt)
{

	for ($i = 0; $i < $N_Alt; $i++) {

		$Result[$i][0] = 0;
		$Result[$i][1] = $Alt[$i]; //CADA POSICAO DE RESULT EH DO TIPO (DESEMPENHO_ALTERNATIVA; NOME_ALTERNATIVA)

		for ($j = 0; $j < $N_Qualit + $N_Quant; $j++) {

			$Result[$i][0] += $FinalMatrix[$j][$i];
		}
	}
}

function PrintSquareResult(&$ResultMatrix, $Alt, $RelativeProximity, $PositiveDistance, $NegativeDistance, $N_Alt)
{
	//Matrix
	//echo "<b>Matriz Resultado</b><br>";

	for ($j = 0; $j < $N_Alt; $j++) {

		$ResultMatrix[$j][0] = $RelativeProximity[$j];
		$ResultMatrix[$j][1] = $Alt[$j];
		$ResultMatrix[$j][2] = $PositiveDistance[$j];
		$ResultMatrix[$j][3] = $NegativeDistance[$j];

		//echo $Alt[$j]." | ".number_format((float)$ResultMatrix[$j][1], 4, '.', '')." | ".number_format((float)$ResultMatrix[$j][2], 4, '.', '')." | ".number_format((float)$ResultMatrix[$j][0], 4, '.', '')." | <br>";
	}

	echo "<div style=\"width:100%;min-height:200px;\">";
	echo "<div style=\"float:left;margin-left:130px;\">";
	echo "<br><table class=\"NORMALIZED\"> <tr>";

	echo "<th></th><th>D+</th><th>D-</th><th>RS</th>";

	echo "  <th><div class=\"tooltip\"><i style=\"color:#01346ec2;font-size:16px;\" class=\"fa fa-fw fa-info-circle\"></i>
    <span class=\"tooltiptext2\">
      <text style=\"color: #fff; font-size:16px; text-align: left;font-weight:200;\">
      <text class=\"lang\">D+ : Distância para a solução ideal positiva.</text>
      <br><text class=\"lang\">D- : Distância para a solução ideal negativa.</text>
      <br><text class=\"lang\">RS : Proximidade relativa.</text>
      </text>
    </span>
  </div></th></tr>";

	for ($j = 0; $j < $N_Alt; $j++) {

		echo "<tr><th>". $ResultMatrix[$j][1] . "</th><td>" . number_format((float)$ResultMatrix[$j][2], 4, '.', '') . "</td><td>" . number_format((float)$ResultMatrix[$j][3], 4, '.', '') . "</td><td>" . number_format((float)$ResultMatrix[$j][0], 4, '.', '') . "</td></tr>";
	}
	echo "</table>";

	echo "</div>";

	echo "<div>";

	PrintResult($ResultMatrix, $N_Alt);//RESULTADO PARA CADA TIPO DE NORMALIACAO (SQUARE OU MINMAX)

	echo "</div></div>";
}

function PrintResult(&$Result,$N_Alt)
{

	rsort($Result); //DO MAIOR PARA O MENOR (MELHOR ALTERNATIVA ESTA NA PRIMEIRA POSICAO)
	
	echo "<br><table class=\"RESULT\"> <tr>";

	echo "<th class=\"lang\">Alternativa</th><th class=\"lang\">Pontuação Obtida</th></tr>";

	for($i=0;$i<$N_Alt;$i++) { //CADA POSICAO DE RESULT EH DO TIPO (DESEMPENHO_ALTERNATIVA; NOME_ALTERNATIVA)
		
		if($i == 0){
			echo "<tr style=\"outline:3px solid #e6da3b;\"><td>" . $Result[$i][1] . "</td><td>" . number_format((float)$Result[$i][0], 4, '.', '')."</td></tr>";
		}
		else if($i == 1){
			echo "<tr  style=\"outline:3px solid #b4c7df;\"><td>" . $Result[$i][1] . "</td><td>" . number_format((float)$Result[$i][0], 4, '.', '')."</td></tr>";
		}
		else if($i == 2){
			echo "<tr style=\"outline:3px solid #a57315;\"><td>" . $Result[$i][1] . "</td><td>" . number_format((float)$Result[$i][0], 4, '.', '')."</td></tr>";
		}
		else{
			echo "<tr><td>" . $Result[$i][1] . "</td><td>" . number_format((float)$Result[$i][0], 4, '.', '')."</td></tr>";
		}
	}

	echo "</table>";
}