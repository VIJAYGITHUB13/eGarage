<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "clients":
		$data = json_decode(file_get_contents("php://input"));

		$request_id = trim($data->requestIDModel);
		$name = trim($data->nameModel);
		$mobile_no = trim($data->mobileNoModel);
		$email_id = trim($data->emailIDModel);

		$cond_ar = [];
		if($request_id) {
			array_push($cond_ar, "jr.`request_id` LIKE '%".$request_id."%'");
		}

		if($name) {
			array_push($cond_ar, "ju.`display_name` LIKE '%".$name."%'");
		}

		if($mobile_no) {
			array_push($cond_ar, "juc.`mobile_no` LIKE '%".$mobile_no."%'");
		}

		if($email_id) {
			array_push($cond_ar, "juc.`email_id` LIKE '%".$email_id."%'");
		}

		if(count($cond_ar)) {
			$query = mysql_query("SELECT ju.`id`, ju.`user_cat_id`, ju.`username`, ju.`display_name` as name, juc.`mobile_no`, juc.`email_id`, (UNIX_TIMESTAMP(ju.`created_on`) * 1000) AS created_on, jr.`request_id` FROM `jos_users` ju LEFT JOIN (SELECT `client_id`, `request_id` FROM `jos_requests`) jr ON ju.`id` = jr.`client_id`, `jos_user_contact` juc WHERE ju.`user_cat_id` = 4 AND ju.`block` = 0 AND ju.`id` = juc.`user_id` AND (".implode(" OR ", $cond_ar).") GROUP BY ju.`id`");

			print jsonEncode($query);
		}
	break;

	case "users":
		$query_superadmins = mysql_query("SELECT ju.`id`, CONCAT('(', IF(((ju.`username` IS NULL) OR (ju.`username` = '')), '-', ju.`username`), ') ', ju.`display_name`) AS name, jucat.`display_name` AS ucategory, ju.`username` FROM `jos_users` ju, `jos_user_categories` jucat, `jos_user_contact` juc WHERE ju.`user_cat_id` = 1 AND ju.`block` = 0 AND ju.`user_cat_id` = jucat.`id` AND ju.`id` = juc.`user_id` GROUP BY ju.`user_cat_id`, ju.`id` ORDER BY ju.`user_cat_id`, ju.`display_name`");
		$query_admins = mysql_query("SELECT ju.`id`, CONCAT('(', IF(((ju.`username` IS NULL) OR (ju.`username` = '')), '-', ju.`username`), ') ', ju.`display_name`) AS name, jucat.`display_name` AS ucategory, ju.`username` FROM `jos_users` ju, `jos_user_categories` jucat, `jos_user_contact` juc WHERE ju.`user_cat_id` = 2 AND ju.`block` = 0 AND ju.`user_cat_id` = jucat.`id` AND ju.`id` = juc.`user_id` GROUP BY ju.`user_cat_id`, ju.`id` ORDER BY ju.`user_cat_id`, ju.`display_name`");
		$query_employees = mysql_query("SELECT ju.`id`, CONCAT('(', IF(((ju.`username` IS NULL) OR (ju.`username` = '')), '-', ju.`username`), ') ', ju.`display_name`) AS name, jucat.`display_name` AS ucategory, ju.`username` FROM `jos_users` ju, `jos_user_categories` jucat, `jos_user_contact` juc WHERE ju.`user_cat_id` = 3 AND ju.`block` = 0 AND ju.`user_cat_id` = jucat.`id` AND ju.`id` = juc.`user_id` GROUP BY ju.`user_cat_id`, ju.`id` ORDER BY ju.`user_cat_id`, ju.`display_name`");

		print json_encode([json_decode(jsonEncode($query_superadmins)), json_decode(jsonEncode($query_admins)), json_decode(jsonEncode($query_employees))]);
	break;

	case "jobtypes":
		$query = mysql_query("SELECT `id`, `name` FROM `jos_req_job_types`");

		print jsonEncode($query);
	break;

	case "create":
		$data = json_decode(file_get_contents("php://input"));

		// Client Details >>
		$client_id = $data->clientIDModel;
		// <<

		if(!$client_id) {
			$mobile_no = $data->mobileNoModel;
			$email_id = trim($data->emailIDModel);

			$cond_ar = [];
			if($mobile_no) {
				array_push($cond_ar, "juc.`mobile_no` LIKE '%".$mobile_no."%'");
			}

			if($email_id) {
				array_push($cond_ar, "juc.`email_id` LIKE '%".$email_id."%'");
			}

			$is_exists = 0;
			if(count($cond_ar)) {
				$is_exists = mysql_result(mysql_query("SELECT COUNT(ju.`id`) FROM `jos_user_contact` juc, `jos_users` ju WHERE juc.`user_id` = ju.`id` AND ju.`user_cat_id` = 4 AND (".implode(" OR ", $cond_ar).")"), 0);
			}

			if($is_exists) {
				print '{ "status": "ALREADY_EXISTS" }';
			} else {
				$myid = trim($data->myid);

				$first_name = trim($data->firstNameModel);
				$last_name = trim($data->lastNameModel);

				$uname = ($first_name." ".$last_name);
				$block = 0;

				$is_username_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_users`"), 0);

				$code_prefix = "EGC";
				if($is_username_exists) {
					$username = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(ju.`inc_id`, 5, '0')) AS username FROM (SELECT (SUBSTRING(`username`, ".(strlen($code_prefix) + 1).") + 1) AS inc_id FROM `jos_users` WHERE `user_cat_id` IN (4) ORDER BY `username` DESC LIMIT 0, 1) ju"), 0);
				} else {
					$username = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(1, 5, '0'))"), 0);
				}

				$insert_ju = mysql_query("INSERT INTO `jos_users`(`id`, `user_cat_id`, `name`, `display_name`, `created_by`, `created_on`, `block`) VALUES (NULL, 4, '".str_replace(" ", "_", strtolower($uname))."', '".$uname."', ".$myid.", NOW(), ".$block.")");
				$last_inserted_id_ju = mysql_insert_id();

				if(!$username) {
					$username = ("EG".$last_inserted_id_ju);
				}

				$password = "password";
				$update_ju = mysql_query("UPDATE `jos_users` SET `username` = '".$username."', `tpassword` = '".$password."', `password` = '".md5($password)."' WHERE `id` = ".$last_inserted_id_ju);

				$insert_juc = mysql_query("INSERT INTO `jos_user_contact` (`id`, `user_id`, `mobile_no`, `email_id`) VALUES (NULL, ".$last_inserted_id_ju.", ".$mobile_no.", '".$email_id."')");

				$insert_jupd = mysql_query("INSERT INTO `jos_user_personal_details` (`id`, `user_id`, `first_name`, `last_name`) VALUES (NULL, ".$last_inserted_id_ju.", '".$first_name."', '".$last_name."')");

				if($insert_ju && $update_ju && $insert_juc && $insert_jupd) {
					$client_id = $last_inserted_id_ju;
				} else {
					print '{ "status": "ERROR_DB" }';
				}
			}
		}

		if($client_id) {
			$is_request_id_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_requests`"), 0);

			$code_prefix = "EGREQ";
			if($is_request_id_exists) {
				$request_id = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(jr.`inc_id`, 5, '0')) AS code FROM (SELECT (SUBSTRING(`request_id`, ".(strlen($code_prefix) + 1).") + 1) AS inc_id FROM `jos_requests` ORDER BY `request_id` DESC LIMIT 0, 1) jr"), 0);
			} else {
				$request_id = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(1, 5, '0'))"), 0);
			}

			if($request_id) {
				$myid = trim($data->myid);

				// Vehicle Details >>
				$vehicle_type = trim($data->vehicleTypeModel);
				$vehicle_no = trim($data->vehicleNoModel);
				$model_no = trim($data->modelNoModel);
				$chasis_no = trim($data->chasisNoModel);
				$engine_no = trim($data->engineNoModel);
				$manufactured_year = $data->manufacturedYearModel;
				$odometer_reading = $data->odometerReadingModel;
				// <<

				// Receiving Details >>
				$receiving_on = trim($data->receivingOnModel);
				// $receiving_by = $data->receivingByModel;
				$assignee = $data->assigneeModel;
				$approver = $data->approverModel;
				// <<

				// Job Details >>
				$jobs_ar = $data->jobsAr;
				// <<

				$insert_jr = mysql_query("INSERT INTO `jos_requests` (`id`, `request_id`, `status_id`, `client_id`, `created_by`, `created_on`, `assignee`, `approver`) VALUES (NULL, '".$request_id."', 1, ".$client_id.", ".$myid.", '".$receiving_on."', ".$assignee.", ".$approver.")");
				$last_inserted_id_jr = mysql_insert_id();

				$insert_jrv = mysql_query("INSERT INTO `jos_req_vehicles` (`id`, `req_id`, `vehicle_type`, `vehicle_no`, `model_no`, `chasis_no`, `engine_no`, `manufactured_year`, `odometer_reading`) VALUES (NULL, ".$last_inserted_id_jr.", '".$vehicle_type."', '".$vehicle_no."', '".$model_no."', '".$chasis_no."', '".$engine_no."', ".$manufactured_year.", ".$odometer_reading.")");

				$insert_jrj_cnt = 0;
				foreach($jobs_ar as $key => $job_obj) {
					$is_add_job = $job_obj->isAddJob;
					$job = $job_obj->job;
					$job_name = trim($job_obj->jobName);
					$remark = trim($job_obj->remark);

					if($is_add_job) {
						$insert_jrjt = mysql_query("INSERT INTO `jos_req_job_types` (`id`, `name`, `created_by`, `created_on`) VALUES (NULL, '".$job_name."', ".$myid.", '".$receiving_on."')");
						$job = mysql_insert_id();
					}

					if($job) {
						$insert_jrj = mysql_query("INSERT INTO `jos_req_jobs` (`id`, `req_id`, `job_type_id`, `client_remark`, `assignee_remark`, `item_id`, `item_quantity`, `item_discount`, `item_total`, `service_charge`, `total`, `started_on`, `ended_on`) VALUES (NULL, ".$last_inserted_id_jr.", ".$job.", '".$remark."', '', 0, 0, 0, 0, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00')");

						if($insert_jrj) {
							$insert_jrj_cnt++;
						}
					}
				}

				if($insert_jr && $insert_jrv && (count($jobs_ar) == $insert_jrj_cnt)) {
					print '{ "status": "SUCCESS", "response": '.$last_inserted_id_jr.' }';
				} else {
					print '{ "status": "ERROR_DB" }';
				}
			} else {
				print '{ "status": "ERROR_DB" }';
			}
		}
	break;
}
?>