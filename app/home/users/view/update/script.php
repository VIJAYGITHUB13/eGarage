<?php
include "../../../../../assets/script/conf.php";

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

	case "userprofile":
		$data = json_decode(file_get_contents("php://input"));

		$user_id = trim($data->userid);

		$query = mysql_query("SELECT ju.`id`, ju.`user_cat_id`, ju.`user_subcat_id`, jupd.`first_name`, jupd.`last_name`, jupd.`gender`, (UNIX_TIMESTAMP(jupd.`dob`) * 1000) AS dob, jupd.`place_of_birth`, jupd.`marital_status`, jued.`salary`, jued.`leave_balance`, jued.`extra_hours_worked`, juc.`mobile_no`, juc.`alt_mobile_no`, juc.`email_id`, juc.`alt_email_id`, juc.`present_add_line1`, juc.`present_add_line2`, juc.`present_add_landmark`, juc.`present_add_country_id`, juc.`present_add_state_id`, juc.`present_add_district_id`, juc.`present_add_pincode`, juc.`permanent_add_line1`, juc.`permanent_add_line2`, juc.`permanent_add_landmark`, juc.`permanent_add_country_id`, juc.`permanent_add_state_id`, juc.`permanent_add_district_id`, juc.`permanent_add_pincode` FROM `jos_users` ju LEFT JOIN (SELECT `user_id`, `salary`, `leave_balance`, `extra_hours_worked` FROM `jos_user_employee_details`) jued ON ju.`id` = jued.`user_id` LEFT JOIN (SELECT `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id` FROM `jos_user_personal_details`) jupd ON ju.`id` = jupd.`user_id`, `jos_user_contact` juc WHERE ju.`id` = ".$user_id." AND ju.`id` = juc.`user_id`");

		print jsonEncode($query);
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);
		$user_id = trim($data->userIDModel);
		$user_subcategory = $data->userCategoryModel;

		$user_category = mysql_result(mysql_query("SELECT `user_cat_id` FROM `jos_user_category_details` WHERE `id` = ".$user_subcategory), 0);

		$first_name = trim($data->firstNameModel);
		$last_name = trim($data->lastNameModel);

		$displayname = ($first_name." ".$last_name);
		$name = str_replace(" ", "_", strtolower($displayname));

		$mobile_no = $data->mobileNoModel;
		$alt_mobile_no = $data->altMobileNoModel;
		$email_id = trim($data->emailIDModel);
		$alt_email_id = trim($data->altEmailIDModel);

		$gender = $data->genderModel;
		$dob = trim($data->dobModel);
		$place_of_birth = trim($data->placeOfBirthModel);
		$marital_status = $data->maritalStatusModel;

		$salary = 0;
		$leave_balance = 0;
		$extra_hours_worked = 0;
		if($user_category != 4) {
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

		if($user_category != 4) {
			$update_jued = mysql_query("UPDATE `jos_user_employee_details` SET `salary` = ".$salary.", `leave_balance` = ".$leave_balance.", `extra_hours_worked` = ".$extra_hours_worked." WHERE `user_id` = ".$user_id);
		}

		$query = mysql_query("UPDATE `jos_users` ju, `jos_user_personal_details` jupd, `jos_user_contact` juc SET ju.`user_cat_id` = ".$user_category.", ju.`user_subcat_id` = ".$user_subcategory.", ju.`name` = '".$name."', ju.`display_name` = '".$displayname."', ju.`modified_by` = ".$myid.", ju.`modified_on` = NOW(), jupd.`first_name` = '".$first_name."', jupd.`last_name` = '".$last_name."', jupd.`gender` = ".$gender.", jupd.`dob` = '".$dob."', jupd.`place_of_birth` = '".$place_of_birth."', jupd.`marital_status` = ".$marital_status.", juc.`mobile_no` = ".$mobile_no.", juc.`alt_mobile_no` = ".$alt_mobile_no.", juc.`email_id` = '".$email_id."', juc.`alt_email_id` = '".$alt_email_id."', juc.`present_add_line1` = '".$present_add_line1."', juc.`present_add_line2` = '".$present_add_line2."', juc.`present_add_landmark` = '".$present_add_landmark."', juc.`present_add_country_id` = ".$present_add_country_id.", juc.`present_add_state_id` = ".$present_add_state_id.", juc.`present_add_district_id` = ".$present_add_district_id.", juc.`present_add_pincode` = ".$present_add_pincode.", juc.`permanent_add_line1` = '".$permanent_add_line1."', juc.`permanent_add_line2` = '".$permanent_add_line2."', juc.`permanent_add_landmark` = '".$permanent_add_landmark."', juc.`permanent_add_country_id` = ".$permanent_add_country_id.", juc.`permanent_add_state_id` = ".$permanent_add_state_id.", juc.`permanent_add_district_id` = ".$permanent_add_district_id.", juc.`permanent_add_pincode` = ".$permanent_add_pincode." WHERE ju.`id` = ".$user_id." AND ju.`id` = juc.`user_id` AND ju.`id` = jupd.`user_id`");

		if($query) {
			print '{ "status": "SUCCESS", "response": '.$user_id.' }';
		} else {
			print '{ "status": "ERROR_DB" }';
		}
	break;
}
?>