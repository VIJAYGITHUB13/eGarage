<?php
// Test CVS

require_once 'lib/reader.php';


// ExcelFile($filename, $encoding);
$data = new Spreadsheet_Excel_Reader();


// Set output Encoding.
$data->setOutputEncoding('CP1251');

/***
* if you want you can change 'iconv' to mb_convert_encoding:
* $data->setUTFEncoder('mb');
*
**/

/***
* By default rows & cols indeces start with 1
* For change initial index use:
* $data->setRowColOffset(0);
*
**/



/***
*  Some function for formatting output.
* $data->setDefaultFormat('%.2f');
* setDefaultFormat - set format for columns with unknown formatting
*
* $data->setColumnFormat(4, '%.3f');
* setColumnFormat - set format for column (apply only to number fields)
*
**/

$uploaddir = 'tmp/';

// ==>CustomLogic
$tmp_fname_ar = array();
if($_GET['appacronym']) { array_push($tmp_fname_ar, strtoupper($_GET['appacronym'])); }
if($_GET['ucategory']) { array_push($tmp_fname_ar, sprintf('%02d', $_GET['ucategory'])); }
if($_GET['uid']) { array_push($tmp_fname_ar, sprintf('%06d', $_GET['uid'])); }
array_push($tmp_fname_ar, date('YmdHis'));

$tmp_fname = '';
$tmp_fname = implode('_', $tmp_fname_ar);

$uploadfile = $uploaddir.$tmp_fname.".xls";

if(file_exists($uploadfile)) {
	print "ALREADY_EXISTS";
} else {
	move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);

	// echo '<pre>';
	// if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
	//     echo "File is valid, and was successfully uploaded.\n";
	// } else {
	//     echo "Possible file upload attack!\n";
	// }


	//print_r($_FILES);
	$fileName = $_FILES['file']['name'];
	$fileType = $_FILES['file']['type'];
	$fileError = $_FILES['file']['error'];
	$fileContent = $_FILES['file']['tmp_name'];

	$data->read($uploadfile);

	/*


	 $data->sheets[0]['numRows'] - count rows
	 $data->sheets[0]['numCols'] - count columns
	 $data->sheets[0]['cells'][$i][$j] - data from $i-row $j-column

	 $data->sheets[0]['cellsInfo'][$i][$j] - extended info about cell
	    
	    $data->sheets[0]['cellsInfo'][$i][$j]['type'] = "date" | "number" | "unknown"
	        if 'type' == "unknown" - use 'raw' value, because  cell contain value with format '0.00';
	    $data->sheets[0]['cellsInfo'][$i][$j]['raw'] = value if cell without format 
	    $data->sheets[0]['cellsInfo'][$i][$j]['colspan'] 
	    $data->sheets[0]['cellsInfo'][$i][$j]['rowspan'] 
	*/

	error_reporting(E_ALL ^ E_NOTICE);

	// $v = '';
	// for ($i = 1; $i <= $data->sheets[0]['numRows']; $i++) {
	// 	for ($j = 1; $j <= $data->sheets[0]['numCols']; $j++) {
	// 		$v .= "\"".$data->sheets[0]['cells'][$i][$j]."\",";
	// 	}
	// 	$v .= "\n";

	// }

	// print $v;

	$rows = array();
	if($data->sheets[0]['numRows'] > 3) {
		for($i=4;$i<=$data->sheets[0]['numRows'];$i++) {
			$cols = array();
			for($j=2;$j<=$data->sheets[0]['numCols'];$j++) {
				$cell = $data->sheets[0]['cells'][$i][$j];
				array_push($cols, $cell);
			}

			array_push($rows, $cols);
		}
	}
	print json_encode($rows);

	unlink($uploadfile);

	//print_r($data);
	//print_r($data->formatRecords);
}
// <==
?>
