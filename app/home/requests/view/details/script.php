<?php
include "../../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "details":
		$data = json_decode(file_get_contents("php://input"));

		$request_id = trim($data->requestid);

		$query = mysql_query(
			"SELECT
				jr.`id`, jr.`request_id`, jr.`status_id`, jrs.`display_name` AS status, jrs.`contextual_color` AS status_css,
				juclient.`client_id`, juclient.`client`, juc.`mobile_no`, juc.`email_id`,
				jr.`created_by` AS created_by_id,
				(UNIX_TIMESTAMP(jr.`created_on`) * 1000) AS created_on,
				jr.`assignee` AS assignee_id, juassignee.`assignee`,
				jr.`approver` AS approver_id, juapprover.`approver`,
				jrv.`id` AS `vehicle_id`,
				jrv.`vehicle_type`, jrv.`vehicle_no`, jrv.`model_no`, jrv.`chasis_no`, jrv.`engine_no`,
				jrv.`manufactured_year`, jrv.`odometer_reading`
			FROM
				`jos_requests` jr
				LEFT JOIN (SELECT jrs.`id`, jrs.`display_name`, jbc.`contextual_color` FROM `jos_req_statuses` jrs, `jos_bootstrap_css` jbc WHERE jrs.`css_id` = jbc.`id`) jrs
					ON jr.`status_id` = jrs.`id`
				LEFT JOIN (SELECT `id`, `username` AS client_id, `display_name` AS client FROM `jos_users`) juclient
					ON jr.`client_id` = juclient.`id`
				LEFT JOIN (SELECT `user_id`, `mobile_no`, `email_id` FROM `jos_user_contact`) juc
					ON jr.`client_id` = juc.`user_id`
				LEFT JOIN (SELECT `id`, CONCAT('(', IF(((`username` IS NULL) OR (`username` = '')), '-', `username`), ') ', `display_name`) AS assignee FROM `jos_users`) juassignee
					ON jr.`assignee` = juassignee.`id`
				LEFT JOIN (SELECT `id`, CONCAT('(', IF(((`username` IS NULL) OR (`username` = '')), '-', `username`), ') ', `display_name`) AS approver FROM `jos_users`) juapprover
					ON jr.`approver` = juapprover.`id`, `jos_req_vehicles` jrv
			WHERE
				jr.`id` = ".$request_id." AND jr.`id` = jrv.`req_id`"
		);

		print jsonEncode($query);
	break;

	case "jobdetails":
		$data = json_decode(file_get_contents("php://input"));

		$request_id = trim($data->requestid);

		$query = mysql_query(
			"SELECT
				jrj.`id`, jrj.`req_id`,
				jrj.`job_type_id`, jrjt.`name` AS job_type,
				jrj.`client_remark`, jrj.`assignee_remark`,
				jrj.`item_id`, jsi.`display_name` AS item,
				jrj.`item_quantity`, jrj.`item_price`, jrj.`item_discount`, jrj.`item_total`,
				jrj.`service_charge`, jrj.`vat`, jrj.`total`,
				(UNIX_TIMESTAMP(jrj.`started_on`) * 1000) AS started_on,
				(UNIX_TIMESTAMP(jrj.`ended_on`) * 1000) AS ended_on
			FROM
				`jos_req_jobs` jrj
				LEFT JOIN (SELECT `id`, `name` FROM `jos_req_job_types`) jrjt
					ON jrj.`job_type_id` = jrjt.`id`
				LEFT JOIN (SELECT `id`, `display_name` FROM `jos_storage_items`) jsi
					ON jrj.`item_id` = jsi.`id`
			WHERE jrj.`req_id` = ".$request_id."
			ORDER BY jrj.`id`"
		);

		print jsonEncode($query);
	break;

	case "close":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$request_id = $data->requestID;

		$update_jr = mysql_query("UPDATE `jos_requests` SET `status_id` = 3, `modified_by` = ".$myid.", `modified_on` = NOW() WHERE `id` = ".$request_id);

		if($update_jr) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "reopen":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$request_id = $data->requestID;

		$update_jr = mysql_query("UPDATE `jos_requests` SET `status_id` = 2, `modified_by` = ".$myid.", `modified_on` = NOW() WHERE `id` = ".$request_id);

		if($update_jr) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>