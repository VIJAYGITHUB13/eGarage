<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "usercategories":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_user_categories` ORDER BY `id`");

		print jsonEncode($query);
	break;
	
	case "addressinputs":
		$query_countries = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_countries` ORDER BY `id`");
		$query_states = mysql_query("SELECT `id`, `country_id`, `display_name` AS name FROM `jos_states` ORDER BY `id`");
		$query_districts = mysql_query("SELECT `id`, `state_id`, `display_name` AS name FROM `jos_districts` ORDER BY `id`");
		
		print json_encode([json_decode(jsonEncode($query_countries)), json_decode(jsonEncode($query_states)), json_decode(jsonEncode($query_districts))]);
	break;

	case "myprofile":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$query = mysql_query("SELECT ju.`user_cat_id`, jucat.`user_category` AS user_cat_name, jupd.`first_name`, jupd.`last_name`, jupd.`gender`, (UNIX_TIMESTAMP(jupd.`dob`) * 1000) AS dob, jupd.`place_of_birth`, jupd.`marital_status`, jued.`salary`, jued.`leave_balance`, jued.`extra_hours_worked`, juc.`mobile_no`, juc.`alt_mobile_no`, juc.`email_id`, juc.`alt_email_id`, juc.`present_add_line1`, juc.`present_add_line2`, juc.`present_add_landmark`, juc.`present_add_country_id`, juc.`present_add_state_id`, juc.`present_add_district_id`, juc.`present_add_pincode`, juc.`permanent_add_line1`, juc.`permanent_add_line2`, juc.`permanent_add_landmark`, juc.`permanent_add_country_id`, juc.`permanent_add_state_id`, juc.`permanent_add_district_id`, juc.`permanent_add_pincode` FROM `jos_users` ju LEFT JOIN (SELECT `user_id`, `salary`, `leave_balance`, `extra_hours_worked` FROM `jos_user_employee_details`) jued ON ju.`id` = jued.`user_id` LEFT JOIN (SELECT jucd.`id`, CONCAT('(', juc.`display_name`, ') ', jucd.`display_name`) AS user_category FROM `jos_user_categories` juc, `jos_user_category_details` jucd WHERE juc.`id` = jucd.`user_cat_id`) jucat ON ju.`user_subcat_id` = jucat.`id` LEFT JOIN (SELECT `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id` FROM `jos_user_personal_details`) jupd ON ju.`id` = jupd.`user_id`, `jos_user_contact` juc WHERE ju.`id` = ".$myid." AND ju.`id` = juc.`user_id`");

		print jsonEncode($query);
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);
		$mycategory = $data->mycategory;

		$issuperadmin = ($data->mycategory == 1);
		$isadmin = ($data->mycategory == 2);
		$isemployee = ($data->mycategory == 3);
		$isclient = ($data->mycategory == 4);

		$user_category = $data->userCategoryModel;

		$first_name_cond = "";
		$last_name_cond = "";
		$uname_cond = "";
		if($issuperadmin || $isadmin) {
			$first_name = trim($data->firstNameModel);
			$last_name = trim($data->lastNameModel);

			$uname = ($first_name." ".$last_name);

			$first_name_cond = ", jupd.`first_name` = '".$first_name."'";
			$last_name_cond = ", jupd.`last_name` = '".$last_name."'";
			$uname_cond = ", ju.`display_name` = '".$uname."'";
		}

		$gender = $data->genderModel;
		$dob = trim($data->dobModel);
		$place_of_birth = trim($data->placeOfBirthModel);
		$marital_status = $data->maritalStatusModel;
		$mobile_no = $data->mobileNoModel;
		$alt_mobile_no = $data->altMobileNoModel;
		$email_id = trim($data->emailIDModel);
		$alt_email_id = trim($data->altEmailIDModel);
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

		$query = mysql_query("UPDATE `jos_users` ju, `jos_user_personal_details` jupd, `jos_user_contact` juc SET ju.`user_cat_id` = '".$user_category."'".$uname_cond.$first_name_cond.$last_name_cond.", jupd.`gender` = ".$gender.", jupd.`dob` = '".$dob."', jupd.`place_of_birth` = '".$place_of_birth."', jupd.`marital_status` = ".$marital_status.", juc.`mobile_no` = ".$mobile_no.", juc.`alt_mobile_no` = ".$alt_mobile_no.", juc.`email_id` = '".$email_id."', juc.`alt_email_id` = '".$alt_email_id."', juc.`present_add_line1` = '".$present_add_line1."', juc.`present_add_line2` = '".$present_add_line2."', juc.`present_add_landmark` = '".$present_add_landmark."', juc.`present_add_country_id` = ".$present_add_country_id.", juc.`present_add_state_id` = ".$present_add_state_id.", juc.`present_add_district_id` = ".$present_add_district_id.", juc.`present_add_pincode` = ".$present_add_pincode.", juc.`permanent_add_line1` = '".$permanent_add_line1."', juc.`permanent_add_line2` = '".$permanent_add_line2."', juc.`permanent_add_landmark` = '".$permanent_add_landmark."', juc.`permanent_add_country_id` = ".$permanent_add_country_id.", juc.`permanent_add_state_id` = ".$permanent_add_state_id.", juc.`permanent_add_district_id` = ".$permanent_add_district_id.", juc.`permanent_add_pincode` = ".$permanent_add_pincode." WHERE ju.`id` = ".$myid." AND ju.`id` = juc.`user_id` AND ju.`id` = jupd.`user_id`");

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>