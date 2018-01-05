<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "usercategories":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_user_categories` ORDER BY `id`");

		print jsonEncode($query);
	break;
}
?>