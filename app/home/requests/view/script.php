<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "statuses":
		$query = mysql_query("SELECT jrs.`id`, jrs.`display_name` AS name, jbc.`container_border_color` AS css_border_color, jbc.`contextual_color` AS css_color FROM `jos_req_statuses` jrs, `jos_bootstrap_css` jbc WHERE jrs.`css_id` = jbc.`id`");
		
		print jsonEncode($query);
	break;

	case "assignees":
		$query = mysql_query("SELECT `id`, CONCAT('(', IF(((`username` IS NULL) OR (`username` = '')), '-', `username`), ') ', `display_name`) AS name FROM `jos_users` WHERE `user_cat_id` = 3 ORDER BY `display_name`");
		
		print jsonEncode($query);
	break;

	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$myid = $data->myid;
		$ucategory = $data->ucategory;

		$request_id = $data->requestID;
		$mobile_no = $data->mobileNo;
		$status = $data->status;
		$assignee = $data->assignee;
		$fdate = (trim($data->fdate) ? date("Y-m-d", strtotime(trim($data->fdate))) : "");
		$tdate = (trim($data->tdate) ? date("Y-m-d", strtotime(trim($data->tdate))) : "");

		$employees_ar = array(3);

		$ucategory_cond = "";
		if(in_array($ucategory, $employees_ar)) {
			$ucategory_cond = "AND (jr.`assignee` = ".$myid." OR jr.`approver` = ".$myid." OR jr.`created_by` = ".$myid.")";
		}

		$cond_ar = [];
		if($request_id) {
			array_push($cond_ar, "jr.`request_id` LIKE '%".$request_id."%'");
		}

		if($mobile_no) {
			array_push($cond_ar, "jucontact.`mobile_no` LIKE '%".$mobile_no."%'");
		}

		if($status) {
			array_push($cond_ar, "jr.`status_id` = ".$status);
		}

		if($assignee) {
			array_push($cond_ar, "jr.`assignee` = ".$assignee);
		}

		if($fdate && $tdate) {
			array_push($cond_ar, "UNIX_TIMESTAMP('".$fdate." 00:00:00') <= UNIX_TIMESTAMP(jr.`created_on`) AND UNIX_TIMESTAMP(jr.`created_on`) <= UNIX_TIMESTAMP('".$tdate." 23:59:59')");
		}

		// MySQL: STR_TO_DATE: DD-MM-YYYY => YYYY-MM-DD
		// MySQL: DATE_FORMAT: YYYY-MM-DD => DD-MM-YYYY
		if(count($cond_ar)) {
			$query = mysql_query(
				"SELECT
					jr.`id`, jr.`request_id`,
					jr.`status_id`, jrs.`display_name` AS status, jrs.`container_border_color` AS css_border_color, jrs.`contextual_bgcolor` AS css_bg_color, jrs.`contextual_color` AS css_color,
					jr.`client_id`, juclient.`display_name` AS client,
					(UNIX_TIMESTAMP(jr.`created_on`) * 1000) AS created_on,
					jrv.`vehicle_no`
				FROM
					`jos_requests` jr
					LEFT JOIN (SELECT jrs.`id`, jrs.`display_name`, jbc.`container_border_color`, jbc.`contextual_bgcolor`, jbc.`contextual_color` FROM `jos_req_statuses` jrs, `jos_bootstrap_css` jbc WHERE jrs.`css_id` = jbc.`id`) jrs
						ON jr.`status_id` = jrs.`id`
					LEFT JOIN (SELECT `id`, `display_name` FROM `jos_users`) juclient
						ON jr.`client_id` = juclient.`id`
					LEFT JOIN (SELECT `user_id`, `mobile_no` FROM `jos_user_contact`) jucontact
						ON jr.`client_id` = jucontact.`user_id`,
					`jos_req_vehicles` jrv
				WHERE
					jr.`id` = jrv.`req_id` ".$ucategory_cond." AND ".implode(" AND ", $cond_ar)."
				GROUP BY UNIX_TIMESTAMP(jr.`created_on`) DESC"
			);

			print jsonEncode($query);
		}
	break;

	case "delete":
		$data = json_decode(file_get_contents("php://input"));

		$request_id = $data->requestID;

		$update_jsis = mysql_query("UPDATE `jos_req_jobs` jrj, `jos_storage_item_sold` jsis SET jsis.`is_sold` = 0 WHERE jrj.`req_id` = ".$request_id." AND FIND_IN_SET(jsis.`id`, jrj.`item_quantity_details`)");

		$query = mysql_query("DELETE FROM `jos_req_jobs` WHERE `req_id` = ".$request_id);
		$query = mysql_query("DELETE FROM `jos_req_vehicles` WHERE `req_id` = ".$request_id);
		$query = mysql_query("DELETE FROM `jos_requests` WHERE `id` = ".$request_id);

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>