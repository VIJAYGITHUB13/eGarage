<?php
include "../../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "upload":
		$data = json_decode(file_get_contents("php://input"));

		$userdetails = $data->userdetails;

		$exist_ar = array();
		for($i=0;$i<count($userdetails);$i++) {
			$mobile_no = trim($userdetails[$i]->mobile_no);
			$email_id = trim($userdetails[$i]->email_id);

			$is_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_user_contact` WHERE `mobile_no` LIKE '%".$mobile_no."%' OR `email_id` LIKE '%".$email_id."%'"), 0);

			if($is_exists) {
				array_push($exist_ar, $userdetails[$i]->ind);
			}
		}

		if(count($exist_ar)) {
			$res_type = "ALREADY_EXISTS";
			$res_msg = "Registration couldn't be processed, as the highlighted user details are already exist(s). Confirm being them unchecked or to retain them, modify their details in the template and upload again.";

			$response = array("type"=>$res_type, "exists_ar"=>$exist_ar, "response"=>$res_msg);
		} else {
			$myid = $data->myid;
			$ucategory = trim($data->ucategory);

			$success_count = 0;
			$error_db_count = 0;
			$registered_ar = array();
			for($i=0;$i<count($userdetails);$i++) {
				$mobile_no = trim($userdetails[$i]->mobile_no);
				$email_id = trim($userdetails[$i]->email_id);

				$first_name = trim($userdetails[$i]->fname);
				$last_name = trim($userdetails[$i]->lname);

				$displayname = ($first_name." ".$last_name);
				$name = formatDName($displayname);
				$block = 0;

				$alt_mobile_no = trim($userdetails[$i]->alt_mobile_no);
				$alt_email_id = trim($userdetails[$i]->alt_email_id);

				// Username generation >>
				$employees_ar = array("1", "2", "3");
				$clients_ar = array("4");

				if(in_array($ucategory, $employees_ar)) {
					$is_username_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_users`"), 0);

					$code_prefix = "EGE";
					if($is_username_exists) {
						$username = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(ju.`inc_id`, 4, '0')) AS username FROM (SELECT (SUBSTRING(`username`, ".(strlen($code_prefix) + 1).") + 1) AS inc_id FROM `jos_users` WHERE `user_cat_id` IN (1, 2, 3) ORDER BY `username` DESC LIMIT 0, 1) ju"), 0);
					} else {
						$username = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(1, 4, '0'))"), 0);
					}
				} else if(in_array($ucategory, $clients_ar)) {
					$is_username_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_users`"), 0);

					$code_prefix = "EGC";
					if($is_username_exists) {
						$username = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(ju.`inc_id`, 4, '0')) AS username FROM (SELECT (SUBSTRING(`username`, ".(strlen($code_prefix) + 1).") + 1) AS inc_id FROM `jos_users` WHERE `user_cat_id` IN (4) ORDER BY `username` DESC LIMIT 0, 1) ju"), 0);
					} else {
						$username = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(1, 4, '0'))"), 0);
					}
				}
				// <<

				$usubcategory = mysql_result(mysql_query("SELECT `id` FROM `jos_user_category_details` WHERE `user_cat_id` = ".$ucategory." ORDER BY display_order ASC LIMIT 0, 1"), 0);

				$insert_ju = mysql_query("INSERT INTO `jos_users`(`id`, `user_cat_id`, `user_subcat_id`, `name`, `display_name`, `created_by`, `created_on`, `block`) VALUES (NULL, ".$ucategory.", ".$usubcategory.", '".$name."', '".$displayname."', ".$myid.", NOW(), ".$block.")");
				$last_inserted_id_ju = mysql_insert_id();

				if(!$username) {
					$username = ("EG".$last_inserted_id_ju);
				}

				$password = "password";
				$update_ju = mysql_query("UPDATE `jos_users` SET `username` = '".$username."', `tpassword` = '".$password."', `password` = '".md5($password)."' WHERE `id` = ".$last_inserted_id_ju);

				// DD-MM-YYYY => YYYY-MM-DD
				$dob = trim($userdetails[$i]->dob);
				$dob_explode = array_reverse(explode("-", $dob));
				$dob = implode("-", $dob_explode);

				$place_of_birth = trim($userdetails[$i]->pob);

				if(strtolower(trim($userdetails[$i]->gender)) == "male") {
					$gender = 0;
				} else if(strtolower(trim($userdetails[$i]->gender)) == "female") {
					$gender = 1;
				}

				if(strtolower(trim($userdetails[$i]->marital_status)) == "unmarried") {
					$marital_status = 0;
				} else if(strtolower(trim($userdetails[$i]->marital_status)) == "married") {
					$marital_status = 1;
				}

				$present_add_line1 = trim($userdetails[$i]->present_add_line1);
				$present_add_line2 = trim($userdetails[$i]->present_add_line2);
				$present_add_landmark = trim($userdetails[$i]->present_add_landmark);

				$permanent_add_line1 = trim($userdetails[$i]->permanent_add_line1);
				$permanent_add_line2 = trim($userdetails[$i]->permanent_add_line2);
				$permanent_add_landmark = trim($userdetails[$i]->permanent_add_landmark);

				$present_add_country_id = getCountryID(formatDName(trim($userdetails[$i]->present_add_country)));
				$permanent_add_country_id = getCountryID(formatDName(trim($userdetails[$i]->permanent_add_country)));

				$present_add_state_id = getStateID($present_add_country_id, formatDName(trim($userdetails[$i]->present_add_state)));
				$permanent_add_state_id = getStateID($permanent_add_country_id, formatDName(trim($userdetails[$i]->permanent_add_state)));

				$present_add_district_id = getDistrictID($present_add_state_id, formatDName(trim($userdetails[$i]->present_add_district)));
				$permanent_add_district_id = getDistrictID($permanent_add_state_id, formatDName(trim($userdetails[$i]->permanent_add_district)));

				$present_add_pincode = trim($userdetails[$i]->present_add_pincode);
				$permanent_add_pincode = trim($userdetails[$i]->permanent_add_pincode);

				if($ucategory != 4) {
					$insert_jued = mysql_query("INSERT INTO `jos_user_employee_details` (`id`, `user_id`, `salary`, `leave_balance`, `extra_hours_worked`) VALUES (NULL, ".$last_inserted_id_ju.", 0, 0, 0)");
				}

				$insert_juc = mysql_query("INSERT INTO `jos_user_contact` (`id`, `user_id`, `mobile_no`, `alt_mobile_no`, `email_id`, `alt_email_id`, `present_add_line1`, `present_add_line2`, `present_add_landmark`, `present_add_country_id`, `present_add_state_id`, `present_add_district_id`, `present_add_pincode`, `permanent_add_line1`, `permanent_add_line2`, `permanent_add_landmark`, `permanent_add_country_id`, `permanent_add_state_id`, `permanent_add_district_id`, `permanent_add_pincode`, `company`) VALUES (NULL, ".$last_inserted_id_ju.", '".$mobile_no."', '".$alt_mobile_no."', '".$email_id."', '".$alt_email_id."', '".$present_add_line1."', '".$present_add_line2."', '".$present_add_landmark."', '".$present_add_country_id."', '".$present_add_state_id."', '".$present_add_district_id."', '".$present_add_pincode."', '".$permanent_add_line1."', '".$permanent_add_line2."', '".$permanent_add_landmark."', '".$permanent_add_country_id."', '".$permanent_add_state_id."', '".$permanent_add_district_id."', '".$permanent_add_pincode."', '')");

				$insert_jupd = mysql_query("INSERT INTO `jos_user_personal_details` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id`) VALUES (NULL, ".$last_inserted_id_ju.", '".$first_name."', '".$last_name."', ".$gender.", '".$dob."', '".$place_of_birth."', ".$marital_status.", '', '', '', '')");

				if($insert_ju && $update_ju && $insert_juc && $insert_jupd) {
					array_push($registered_ar, $userdetails[$i]->ind);
					$success_count++;
				} else {
					$error_db_count++;
				}
			}

			if(count($userdetails) == $success_count) {
				$res_type = "SUCCESS";
				$res_msg = "Created the below users successfully.";
			} else if(count($userdetails) == $error_db_count) {
				$res_type = "ERROR_DB";
				$res_msg = "Server error.";
			} else {
				$res_type = "PARTIAL_SUCCESS";
				$res_msg = "Done with the partial registration of ".$success_count." user details out of ".count($userdetails).".";
			}

			$response = array("type"=>$res_type, "registered_ar"=>$registered_ar, "response"=>$res_msg);
		}

		print json_encode($response);
	break;
}

function formatDName($dname) {
	return str_replace(" ", "_", strtolower($dname));
}

function getCountryID($country_name) {
	return mysql_result(mysql_query("SELECT `id` FROM `jos_countries` WHERE `name` LIKE '".$country_name."'"), 0);
}

function getStateID($country_id, $state_name) {
	return mysql_result(mysql_query("SELECT js.`id` FROM `jos_countries` jc, `jos_states` js WHERE jc.`id` = '".$country_id."' AND js.`name` LIKE '".$state_name."'"), 0);
}

function getDistrictID($state_id, $district_name) {
	return mysql_result(mysql_query("SELECT jd.`id` FROM `jos_states` js, `jos_districts` jd WHERE js.`id` = '".$state_id."' AND jd.`name` LIKE '".$district_name."'"), 0);
}
?>