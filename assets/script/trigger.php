<?php
function jsonEncode($query) {
	$rows = array();
	$i = 0;
	
	while($r = mysql_fetch_assoc($query)) {
		$rows[$i] = $r;
		$i++;
	}
	
	return json_encode($rows);
}
?>