<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "usercategories":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("SELECT juc.`id` AS user_category_id, jucd.`id` AS user_subcategory_id, juc.`display_name` AS user_category, jucd.`display_name` AS user_subcategory FROM `jos_user_categories` juc,  `jos_user_category_details` jucd WHERE juc.`id` = jucd.`user_cat_id` ORDER BY juc.`id`, jucd.`display_order`");

		print jsonEncode($query);
	break;

	case "addressinputs":
		$query_countries = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_countries` ORDER BY `id`");
		$query_states = mysql_query("SELECT `id`, `country_id`, `display_name` AS name FROM `jos_states` ORDER BY `id`");
		$query_districts = mysql_query("SELECT `id`, `state_id`, `display_name` AS name FROM `jos_districts` ORDER BY `id`");
		
		print json_encode([json_decode(jsonEncode($query_countries)), json_decode(jsonEncode($query_states)), json_decode(jsonEncode($query_districts))]);
	break;

	case "create":
		$data = json_decode(file_get_contents("php://input"));

		$mobile_no = $data->mobileNoModel;
		$email_id = trim($data->emailIDModel);

		$is_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_user_contact` WHERE `mobile_no` LIKE '%".$mobile_no."%' OR `email_id` LIKE '%".$email_id."%'"), 0);

		if($is_exists) {
			print '{ "status": "ALREADY_EXISTS" }';
		} else {
			$myid = trim($data->myid);
			$usubcategory = $data->userCategoryModel;

			$ucategory = mysql_result(mysql_query("SELECT `user_cat_id` FROM `jos_user_category_details` WHERE `id` = ".$usubcategory), 0);

			$first_name = trim($data->firstNameModel);
			$last_name = trim($data->lastNameModel);

			$displayname = ($first_name." ".$last_name);
			$name = str_replace(" ", "_", strtolower($displayname));
			$block = 0;

			$alt_mobile_no = $data->altMobileNoModel;
			$alt_email_id = trim($data->altEmailIDModel);

			// Username generation >>
			$employees_ar = array(1, 2, 3);
			$clients_ar = array(4);

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

			$insert_ju = mysql_query("INSERT INTO `jos_users` (`id`, `user_cat_id`, `user_subcat_id`, `name`, `display_name`, `created_by`, `created_on`, `block`) VALUES (NULL, ".$ucategory.", ".$usubcategory.", '".$name."', '".$displayname."', ".$myid.", NOW(), ".$block.")");
			$last_inserted_id_ju = mysql_insert_id();

			if(!$username) {
				$username = ("EG".$last_inserted_id_ju);
			}
			
			$password = "password";
			$update_ju = mysql_query("UPDATE `jos_users` SET `username` = '".$username."', `tpassword` = '".$password."', `password` = '".md5($password)."' WHERE `id` = ".$last_inserted_id_ju);

			$dob = trim($data->dobModel);
			$place_of_birth = trim($data->placeOfBirthModel);
			$gender = $data->genderModel;
			$marital_status = $data->maritalStatusModel;

			$salary = 0;
			$leave_balance = 0;
			$extra_hours_worked = 0;

			if($ucategory != 4) {
				$salary = $data->salaryModel;
				$leave_balance = $data->leaveBalanceModel;
				$extra_hours_worked = $data->extraHoursWorkedModel;
			}

			$present_add_line1 = trim($data->presentAddLine1Model);
			$present_add_line2 = trim($data->presentAddLine2Model);
			$present_add_landmark = trim($data->presentAddLandmarkModel);
			$present_add_country_id = $data->presentAddCountryModel;
			$present_add_state_id = $data->presentAddStateModel;
			$present_add_district_id = $data->presentAddDistrictModel;
			$present_add_pincode = $data->presentAddPincodeModel;

			$permanent_add_line1 = trim($data->permanentAddLine1Model);
			$permanent_add_line2 = trim($data->permanentAddLine2Model);
			$permanent_add_landmark = trim($data->permanentAddLandmarkModel);
			$permanent_add_country_id = $data->permanentAddCountryModel;
			$permanent_add_state_id = $data->permanentAddStateModel;
			$permanent_add_district_id = $data->permanentAddDistrictModel;
			$permanent_add_pincode = $data->permanentAddPincodeModel;

			if($ucategory != 4) {
				$insert_jued = mysql_query("INSERT INTO `jos_user_employee_details` (`id`, `user_id`, `salary`, `leave_balance`, `extra_hours_worked`) VALUES (NULL, ".$last_inserted_id_ju.", ".$salary.", ".$leave_balance.", ".$extra_hours_worked.")");
			}

			$insert_juc = mysql_query("INSERT INTO `jos_user_contact` (`id`, `user_id`, `mobile_no`, `alt_mobile_no`, `email_id`, `alt_email_id`, `present_add_line1`, `present_add_line2`, `present_add_landmark`, `present_add_country_id`, `present_add_state_id`, `present_add_district_id`, `present_add_pincode`, `permanent_add_line1`, `permanent_add_line2`, `permanent_add_landmark`, `permanent_add_country_id`, `permanent_add_state_id`, `permanent_add_district_id`, `permanent_add_pincode`, `company`) VALUES (NULL, ".$last_inserted_id_ju.", ".$mobile_no.", ".$alt_mobile_no.", '".$email_id."', '".$alt_email_id."', '".$present_add_line1."', '".$present_add_line2."', '".$present_add_landmark."', ".$present_add_country_id.", ".$present_add_state_id.", ".$present_add_district_id.", ".$present_add_pincode.", '".$permanent_add_line1."', '".$permanent_add_line2."', '".$permanent_add_landmark."', ".$permanent_add_country_id.", ".$permanent_add_state_id.", ".$permanent_add_district_id.", ".$permanent_add_pincode.", '')");

			$insert_jupd = mysql_query("INSERT INTO `jos_user_personal_details` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id`) VALUES (NULL, ".$last_inserted_id_ju.", '".$first_name."', '".$last_name."', ".$gender.", '".$dob."', '".$place_of_birth."', '".$marital_status."', '', '', '', '')");

			if($insert_ju && $update_ju && $insert_juc && $insert_jupd) {
				print '{ "status": "SUCCESS", "response": '.$last_inserted_id_ju.' }';
			} else {
				print '{ "status": "ERROR_DB" }';
			}
		}
	break;
}
?>