<?php
include "../../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "users":
		$query_superadmins = mysql_query("SELECT ju.`id`, CONCAT('(', IF(((ju.`username` IS NULL) OR (ju.`username` = '')), '-', ju.`username`), ') ', ju.`display_name`) AS name, jucat.`display_name` AS ucategory, ju.`username` FROM `jos_users` ju, `jos_user_categories` jucat, `jos_user_contact` juc WHERE ju.`user_cat_id` = 1 AND `block` = 0 AND ju.`user_cat_id` = jucat.`id` AND ju.`id` = juc.`user_id` GROUP BY ju.`user_cat_id`, ju.`id` ORDER BY ju.`user_cat_id`, ju.`display_name`");
		$query_admins = mysql_query("SELECT ju.`id`, CONCAT('(', IF(((ju.`username` IS NULL) OR (ju.`username` = '')), '-', ju.`username`), ') ', ju.`display_name`) AS name, jucat.`display_name` AS ucategory, ju.`username` FROM `jos_users` ju, `jos_user_categories` jucat, `jos_user_contact` juc WHERE ju.`user_cat_id` = 2 AND `block` = 0 AND ju.`user_cat_id` = jucat.`id` AND ju.`id` = juc.`user_id` GROUP BY ju.`user_cat_id`, ju.`id` ORDER BY ju.`user_cat_id`, ju.`display_name`");
		$query_employees = mysql_query("SELECT ju.`id`, CONCAT('(', IF(((ju.`username` IS NULL) OR (ju.`username` = '')), '-', ju.`username`), ') ', ju.`display_name`) AS name, jucat.`display_name` AS ucategory, ju.`username` FROM `jos_users` ju, `jos_user_categories` jucat, `jos_user_contact` juc WHERE ju.`user_cat_id` = 3 AND `block` = 0 AND ju.`user_cat_id` = jucat.`id` AND ju.`id` = juc.`user_id` GROUP BY ju.`user_cat_id`, ju.`id` ORDER BY ju.`user_cat_id`, ju.`display_name`");

		print json_encode([json_decode(jsonEncode($query_superadmins)), json_decode(jsonEncode($query_admins)), json_decode(jsonEncode($query_employees))]);
	break;

	case "jobtypes":
		$query = mysql_query("SELECT `id`, `name` FROM `jos_req_job_types`");

		print jsonEncode($query);
	break;

	case "storageitems":
		$data = json_decode(file_get_contents("php://input"));

		$request_id = $data->requestid;

		$query = mysql_query(
			"SELECT
				jsic.`id` AS item_cat_id, jsic.`code` AS item_cat_code, jsic.`display_name` AS item_cat_name,
				jsi.`id` AS item_id, jsi.`code` AS item_code, jsi.`display_name` AS item,
				jsii.`code` AS invoice, jsii.`offer_price` AS price,
				jsis.`id` AS item_quantity_id, jsis.`quantity_count`,
				jrj.`item_quantity_details`
			FROM
				`jos_storage_item_categories` jsic,
				`jos_storage_items` jsi
				LEFT JOIN (SELECT `item_id`, `item_quantity_details` FROM `jos_req_jobs` WHERE `req_id` = ".$request_id.") jrj
					ON jsi.`id` = jrj.`item_id`,
				`jos_storage_item_invoices` jsii,
				`jos_storage_item_sold` jsis
			WHERE
				jsic.`id` = jsi.`cat_id`
				AND jsi.`id` = jsii.`item_id`
				AND UNIX_TIMESTAMP(NOW()) >= UNIX_TIMESTAMP(jsii.`ordered_on`)
				AND jsii.`id` = jsis.`invoice_id`
				AND (jsis.`is_sold` = 0 OR FIND_IN_SET(jsis.`id`, jrj.`item_quantity_details`))
			GROUP BY jsi.`id`, jsii.`id`, jsis.`id`
			ORDER BY jsi.`id`, jsii.`id`, jsis.`quantity_count`");

		print jsonEncode($query);
	break;

	case "details":
		$data = json_decode(file_get_contents("php://input"));

		$request_id = $data->requestid;

		$query = mysql_query(
			"SELECT
				jr.`id`, jr.`request_id`, jr.`status_id`, jrs.`display_name` AS status, jrs.`contextual_color` AS status_css,
				jr.`client_id`, juclient.`client`,
				jr.`created_by` AS created_by_id, jucreatedby.`created_by`,
				(UNIX_TIMESTAMP(jr.`created_on`) * 1000) AS created_on,
				jr.`assignee` AS assignee_id, juassignee.`display_name` AS assignee,
				jr.`approver` AS approver_id, juapprover.`display_name` AS approver,
				jrv.`id` AS `vehicle_id`, jrv.`vehicle_type`, jrv.`vehicle_no`
			FROM
				`jos_requests` jr
				LEFT JOIN (SELECT jrs.`id`, jrs.`display_name`, jbc.`contextual_color` FROM `jos_req_statuses` jrs, `jos_bootstrap_css` jbc WHERE jrs.`css_id` = jbc.`id`) jrs
					ON jr.`status_id` = jrs.`id`
				LEFT JOIN (SELECT `id`, CONCAT('(', IF(((`username` IS NULL) OR (`username` = '')), '-', `username`), ') ', `display_name`) AS client FROM `jos_users`) juclient
					ON jr.`client_id` = juclient.`id`
				LEFT JOIN (SELECT `id`, CONCAT('(', IF(((`username` IS NULL) OR (`username` = '')), '-', `username`), ') ', `display_name`) AS created_by FROM `jos_users`) jucreatedby
					ON jr.`created_by` = jucreatedby.`id`
				LEFT JOIN (SELECT `id`, `display_name` FROM `jos_users`) juassignee
					ON jr.`assignee` = juassignee.`id`
				LEFT JOIN (SELECT `id`, `display_name` FROM `jos_users`) juapprover
					ON jr.`approver` = juapprover.`id`, `jos_req_vehicles` jrv
			WHERE
				jr.`id` = ".$request_id." AND jr.`id` = jrv.`req_id`"
		);

		print jsonEncode($query);
	break;

	case "jobdetails":
		$data = json_decode(file_get_contents("php://input"));

		$request_id = $data->requestid;

		$query = mysql_query(
			"SELECT
				jrj.`id`, jrj.`req_id`,
				jrj.`job_type_id`, jrjt.`name` AS job_type,
				jrj.`client_remark`, jrj.`assignee_remark`,
				jrj.`item_id`, jsi.`display_name` AS item,
				jrj.`item_quantity`, jrj.`item_quantity_details`, jrj.`item_price`, jrj.`item_discount`, jrj.`item_total`,
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

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$request_id = $data->requestID;
		$assignee_id = $data->assigneeID;
		$approver_id = $data->approverID;

		$jobs_ar = $data->jobsAr;

		$update_jr = mysql_query("UPDATE `jos_requests` SET `status_id` = 2, `assignee` = ".$assignee_id.", `approver` = ".$approver_id.", `modified_by` = ".$myid.", `modified_on` = NOW() WHERE `id` = ".$request_id);

		$del_jobs_ar = [];
		foreach($jobs_ar as $key => $job_obj) {
			$jobID = $job_obj->jobID;
			if($jobID) {
				array_push($del_jobs_ar, $jobID);
			}
		}

		$update_jsis = mysql_query("UPDATE `jos_req_jobs` jrj, `jos_storage_item_sold` jsis SET jsis.`is_sold` = 0 WHERE jrj.`req_id` = ".$request_id." AND FIND_IN_SET(jsis.`id`, jrj.`item_quantity_details`)");

		if(count($del_jobs_ar)) {
			$delete_jrj = mysql_query("DELETE FROM `jos_req_jobs` WHERE `req_id` = ".$request_id." AND `id` NOT IN (".implode(", ", $del_jobs_ar).")");
		}

		$update_jrj_cnt = 0;
		foreach($jobs_ar as $key => $job_obj) {
			$jobID = $job_obj->jobID;
			$jobTypeID = $job_obj->jobTypeID;
			$jobType = trim($job_obj->jobType);
			$isAddJob = $job_obj->isAddJob;
			$clientRemark = trim($job_obj->clientRemark);
			$assigneeRemark = trim($job_obj->assigneeRemark);
			$itemID = $job_obj->itemID;
			$itemQuantity = $job_obj->itemQuantity;
			$itemQuantityDetails = $job_obj->itemQuantityDetails;
			$itemPrice = $job_obj->itemPrice;
			$itemDiscount = $job_obj->itemDiscount;
			$itemTotal = $job_obj->itemTotal;
			$serviceCharge = $job_obj->serviceCharge;
			$vat = $job_obj->vat;
			$total = $job_obj->total;
			$startedOn = trim($job_obj->startedOn);
			$endedOn = trim($job_obj->endedOn);

			if($isAddJob) {
				$jobTypeID = 0;
				$insert_jrjt = mysql_query("INSERT INTO `jos_req_job_types` (`id`, `name`, `created_by`, `created_on`) VALUES (NULL, '".$jobType."', ".$myid.", NOW())");
				$jobTypeID = mysql_insert_id();
			}

			if($jobID) {
				$update_jrj = mysql_query(
					"UPDATE `jos_req_jobs`
					SET
						`job_type_id` = ".$jobTypeID.",
						`client_remark` = '".$clientRemark."',
						`assignee_remark` = '".$assigneeRemark."',
						`item_id` = ".$itemID.",
						`item_quantity` = ".$itemQuantity.",
						`item_quantity_details` = '".$itemQuantityDetails."',
						`item_price` = ".$itemPrice.",
						`item_discount` = ".$itemDiscount.",
						`item_total` = ".$itemTotal.",
						`service_charge` = ".$serviceCharge.",
						`vat` = ".$vat.",
						`total` = ".$total.",
						`started_on` = '".$startedOn."',
						`ended_on` = '".$endedOn."'
					WHERE `id` = ".$jobID
				);

				if($update_jrj) {
					$update_jrj_cnt++;
				}
			} else {
				$insert_jrj = mysql_query("INSERT INTO `jos_req_jobs` (`id`, `req_id`, `job_type_id`, `client_remark`, `assignee_remark`, `item_id`, `item_quantity`, `item_quantity_details`, `item_discount`, `item_total`, `service_charge`, `vat`, `total`, `started_on`, `ended_on`) VALUES (NULL, ".$request_id.", ".$jobTypeID.", '".$clientRemark."', '".$assigneeRemark."', ".$itemID.", ".$itemQuantity.", '".$itemQuantityDetails."', ".$itemDiscount.", ".$itemTotal.", ".$serviceCharge.", ".$vat.", ".$total.", '".$startedOn."', '".$endedOn."')");

				if($insert_jrj) {
					$update_jrj_cnt++;
				}
			}
		}

		$update_jsis = mysql_query("UPDATE `jos_req_jobs` jrj, `jos_storage_item_sold` jsis SET jsis.`is_sold` = 1 WHERE jrj.`req_id` = ".$request_id." AND FIND_IN_SET(jsis.`id`, jrj.`item_quantity_details`)");

		if($update_jr && (count($jobs_ar) == $update_jrj_cnt)) {
			print '{ "status": "SUCCESS", "response": '.$request_id.' }';
		} else {
			print '{ "status": "ERROR_DB" }';
		}
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
}
?>