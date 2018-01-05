<?php
include "../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "visitingcount":
		$data = json_decode(file_get_contents("php://input"));
		$myid = trim($data->myid);

		$query = mysql_query("SELECT `visiting_count`, `display_name` AS name FROM `jos_users` WHERE `id` = ".$myid);
		
		print jsonEncode($query);
	break;

	case "stats":
		$query = mysql_query(
			"SELECT
				reqopen.`requests_open`, reqinprogress.`requests_inprogress`, reqclosed.`requests_closed`,
				juclient.`clients`, juemp.`employees`, jsi.`storage_items`
			FROM
				(SELECT COUNT(`id`) AS requests_open FROM `jos_requests` WHERE `status_id` = 1) reqopen,
				(SELECT COUNT(`id`) AS requests_inprogress FROM `jos_requests` WHERE `status_id` = 2) reqinprogress,
				(SELECT COUNT(`id`) AS requests_closed FROM `jos_requests` WHERE `status_id` = 3) reqclosed,
				(SELECT COUNT(`id`) AS clients FROM `jos_users` WHERE `user_cat_id` = 4) juclient,
				(SELECT COUNT(`id`) AS employees FROM `jos_users` WHERE `user_cat_id` = 3) juemp,
				(SELECT SUM(`item_quantity`) AS storage_items FROM `jos_req_jobs` WHERE `item_id` != 0) jsi"
		);
		
		print jsonEncode($query);
	break;
}
?>