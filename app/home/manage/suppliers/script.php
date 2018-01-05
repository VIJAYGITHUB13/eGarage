<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$code = trim($data->supCode);
		$name = trim($data->supName);
		$contact_no = $data->supContactNo;
		$fdate = (trim($data->fdate) ? date("Y-m-d", strtotime(trim($data->fdate))) : "");
		$tdate = (trim($data->tdate) ? date("Y-m-d", strtotime(trim($data->tdate))) : "");

		$cond_ar = [];
		if($code) {
			array_push($cond_ar, "js.`code` LIKE '%".$code."%'");
		}

		if($name) {
			array_push($cond_ar, "js.`display_name` LIKE '%".$name."%'");
		}

		if($contact_no) {
			array_push($cond_ar, "js.`contact_no` LIKE %".$contact_no."%");
		}

		if($fdate && $tdate) {
			array_push($cond_ar, "UNIX_TIMESTAMP('".$fdate." 00:00:00') <= UNIX_TIMESTAMP(js.`created_on`) AND UNIX_TIMESTAMP(js.`created_on`) <= UNIX_TIMESTAMP('".$tdate." 23:59:59')");
		}

		// MySQL: STR_TO_DATE: DD-MM-YYYY => YYYY-MM-DD
		// MySQL: DATE_FORMAT: YYYY-MM-DD => DD-MM-YYYY
		if(count($cond_ar)) {
			$query = mysql_query("SELECT js.`id`, js.`code`, js.`display_name` AS name, IFNULL(jsii.`invoice_count`, 0) AS invoice_count, js.`contact_no`, js.`email_id`, js.`address`, js.`created_by`, (UNIX_TIMESTAMP(js.`created_on`) * 1000) AS created_on FROM `jos_suppliers` js LEFT JOIN (SELECT `sup_id`, COUNT(`id`) AS invoice_count FROM `jos_storage_item_invoices` GROUP BY `sup_id` ORDER BY `sup_id`) jsii ON js.`id` = jsii.`sup_id` WHERE 1 AND ".implode(" AND ", $cond_ar)." ORDER BY UNIX_TIMESTAMP(js.`created_on`) DESC");

			print jsonEncode($query);
		}
	break;

	case "add":
		$data = json_decode(file_get_contents("php://input"));

		$contact_no = trim($data->supContactNo);
		$email_id = trim($data->supEmailID);

		$is_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_suppliers` WHERE `contact_no` LIKE '%".$contact_no."%' OR `email_id` LIKE '%".$email_id."%'"), 0);

		if($is_exists) {
			print "ALREADY_EXISTS";
		} else {
			$myid = trim($data->myid);

			$sup_dname = trim($data->supName);
			$address = trim($data->supAddress);

			$sup_name = str_replace(" ", "_", strtolower($sup_dname));

			$is_code_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_suppliers`"), 0);

			$code_prefix = "SUP";
			if($is_code_exists) {
				$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(js.`inc_id`, 4, '0')) AS code FROM (SELECT (SUBSTRING(`code`, ".(strlen($code_prefix) + 1).") + 1) AS inc_id FROM `jos_suppliers` ORDER BY `code` DESC LIMIT 0, 1) js"), 0);
			} else {
				$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(1, 4, '0'))"), 0);
			}

			$query = mysql_query("INSERT INTO `jos_suppliers` (`id`, `code`, `name`, `display_name`, `contact_no`, `email_id`, `address`, `created_by`, `created_on`) VALUES (NULL, '".$code."', '".$sup_name."', '".$sup_dname."', '".$contact_no."', '".$email_id."', '".$address."', ".$myid.", NOW())");

			if($query) {
				print "SUCCESS";
			} else {
				print "ERROR_DB";
			}
		}
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$sup_id = $data->supID;
		$sup_dname = trim($data->supName);
		$contact_no = trim($data->supContactNo);
		$email_id = trim($data->supEmailID);
		$address = trim($data->supAddress);

		$sup_name = str_replace(" ", "_", strtolower($sup_dname));

		$query = mysql_query("UPDATE `jos_suppliers` SET `name` = '".$sup_name."', `display_name` = '".$sup_dname."', `contact_no` = '".$contact_no."', `email_id` = '".$email_id."', `address` = '".$address."', `modified_by` = ".$myid.", `modified_on` = NOW() WHERE `id` = ".$sup_id);

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "delete":
		$data = json_decode(file_get_contents("php://input"));

		$sup_id = $data->supID;

		$query = mysql_query("DELETE FROM `jos_suppliers` WHERE `id` = ".$sup_id);

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>