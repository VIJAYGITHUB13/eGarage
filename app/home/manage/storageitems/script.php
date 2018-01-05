<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$code = trim($data->catCode);
		$name = trim($data->catName);
		$fdate = (trim($data->fdate) ? date("Y-m-d", strtotime(trim($data->fdate))) : "");
		$tdate = (trim($data->tdate) ? date("Y-m-d", strtotime(trim($data->tdate))) : "");

		$cond_ar = [];
		if($code) {
			array_push($cond_ar, "jsic.`code` LIKE '%".$code."%'");
		}

		if($name) {
			array_push($cond_ar, "jsic.`display_name` LIKE '%".$name."%'");
		}

		if($fdate && $tdate) {
			array_push($cond_ar, "UNIX_TIMESTAMP('".$fdate." 00:00:00') <= UNIX_TIMESTAMP(jsic.`created_on`) AND UNIX_TIMESTAMP(jsic.`created_on`) <= UNIX_TIMESTAMP('".$tdate." 23:59:59')");
		}

		// MySQL: STR_TO_DATE: DD-MM-YYYY => YYYY-MM-DD
		// MySQL: DATE_FORMAT: YYYY-MM-DD => DD-MM-YYYY
		if(count($cond_ar)) {
			$query = mysql_query("SELECT jsic.`id`, jsic.`code`, jsic.`display_name` AS name, IFNULL(jsi.`item_count`, 0) AS item_count, jsic.`created_by`, (UNIX_TIMESTAMP(jsic.`created_on`) * 1000) AS created_on FROM `jos_storage_item_categories` jsic LEFT JOIN (SELECT `cat_id`, COUNT(`id`) AS item_count FROM `jos_storage_items` GROUP BY `cat_id` ORDER BY `cat_id`) jsi ON jsic.`id` = jsi.`cat_id` WHERE 1 AND ".implode(" AND ", $cond_ar)." ORDER BY UNIX_TIMESTAMP(jsic.`created_on`) DESC");

			print jsonEncode($query);
		}
	break;

	case "add":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$cat_dname = trim($data->catName);

		$cat_name = str_replace(" ", "_", strtolower($cat_dname));

		$is_code_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_storage_item_categories`"), 0);

		$code_prefix = "UNITCAT";
		if($is_code_exists) {
			$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(jsi.`inc_id`, 4, '0')) AS code FROM (SELECT (SUBSTRING(`code`, ".(strlen($code_prefix) + 1).") + 1) AS inc_id FROM `jos_storage_item_categories` ORDER BY `code` DESC LIMIT 0, 1) jsi"), 0);
		} else {
			$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(1, 4, '0'))"), 0);
		}

		$query = mysql_query("INSERT INTO `jos_storage_item_categories` (`id`, `code`, `name`, `display_name`, `created_by`, `created_on`) VALUES (NULL, '".$code."', '".$cat_name."', '".$cat_dname."', ".$myid.", NOW())");

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$cat_id = $data->catID;
		$cat_dname = trim($data->catName);

		$cat_name = str_replace(" ", "_", strtolower($cat_dname));

		$query = mysql_query("UPDATE `jos_storage_item_categories` SET `name` = '".$cat_name."', `display_name` = '".$cat_dname."', `modified_by` = ".$myid.", `modified_on` = NOW() WHERE `id` = ".$cat_id);

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "delete":
		$data = json_decode(file_get_contents("php://input"));

		$cat_id = $data->catID;

		$query = mysql_query("DELETE FROM `jos_storage_item_categories` WHERE `id` = ".$cat_id);

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "storageitems":
		$data = json_decode(file_get_contents("php://input"));

		$cat_id = $data->catID;

		$query = mysql_query("SELECT jsi.`id`, jsi.`code`, jsi.`display_name` AS name, IFNULL(jrj.`item_installed_count`, 0) AS item_installed_count, (UNIX_TIMESTAMP(jsi.`created_on`) * 1000) AS created_on FROM `jos_storage_items` jsi LEFT JOIN (SELECT `item_id`, COUNT(`id`) AS item_installed_count FROM `jos_req_jobs` WHERE `item_id` != 0 GROUP BY `item_id` ORDER BY `item_id`) jrj ON jsi.`id` = jrj.`item_id` WHERE jsi.`cat_id` = ".$cat_id." ORDER BY UNIX_TIMESTAMP(jsi.`created_on`) DESC");

		print jsonEncode($query);
	break;

	case "addstorageitem":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$category = trim($data->category);
		$unit_dname = trim($data->unitName);

		$unit_name = str_replace(" ", "_", strtolower($unit_dname));

		$is_code_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_storage_items`"), 0);

		$code_prefix = "UNIT";
		if($is_code_exists) {
			$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(jsi.`inc_id`, 5, '0')) AS code FROM (SELECT (SUBSTRING(`code`, ".(strlen($code_prefix) + 1).") + 1) AS inc_id FROM `jos_storage_items` ORDER BY `code` DESC LIMIT 0, 1) jsi"), 0);
		} else {
			$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(1, 5, '0'))"), 0);
		}

		$query = mysql_query("INSERT INTO `jos_storage_items` (`id`, `cat_id`, `code`, `name`, `display_name`, `created_by`, `created_on`) VALUES (NULL, ".$category.", '".$code."', '".$unit_name."', '".$unit_dname."', ".$myid.", NOW())");

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "updatestorageitem":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$unit_id = $data->unitID;
		$unit_dname = trim($data->unitName);

		$unit_name = str_replace(" ", "_", strtolower($unit_dname));

		$query = mysql_query("UPDATE `jos_storage_items` SET `name` = '".$unit_name."', `display_name` = '".$unit_dname."', `modified_by` = ".$myid.", `modified_on` = NOW() WHERE `id` = ".$unit_id);

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "deletestorageitem":
		$data = json_decode(file_get_contents("php://input"));

		$unit_id = $data->unitID;

		$query = mysql_query("DELETE FROM `jos_storage_items` WHERE `id` = ".$unit_id);

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>