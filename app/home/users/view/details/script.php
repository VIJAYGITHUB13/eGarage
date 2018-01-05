<?php
include "../../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "addressinputs":
		$query_countries = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_countries` ORDER BY `id`");
		$query_states = mysql_query("SELECT `id`, `country_id`, `display_name` AS name FROM `jos_states` ORDER BY `id`");
		$query_districts = mysql_query("SELECT `id`, `state_id`, `display_name` AS name FROM `jos_districts` ORDER BY `id`");
		
		print json_encode([json_decode(jsonEncode($query_countries)), json_decode(jsonEncode($query_states)), json_decode(jsonEncode($query_districts))]);
	break;

	case "userprofile":
		$data = json_decode(file_get_contents("php://input"));

		$user_id = trim($data->userid);

		$query = mysql_query("SELECT ju.`id`, ju.`user_cat_id`, jucat.`user_category`, jupd.`first_name`, jupd.`last_name`, jupd.`gender`, (UNIX_TIMESTAMP(jupd.`dob`) * 1000) AS dob, jupd.`place_of_birth`, jupd.`marital_status`, jued.`salary`, jued.`leave_balance`, jued.`extra_hours_worked`, juc.`mobile_no`, juc.`alt_mobile_no`, juc.`email_id`, juc.`alt_email_id`, juc.`present_add_line1`, juc.`present_add_line2`, juc.`present_add_landmark`, juc.`present_add_country_id`, juc.`present_add_state_id`, juc.`present_add_district_id`, juc.`present_add_pincode`, juc.`permanent_add_line1`, juc.`permanent_add_line2`, juc.`permanent_add_landmark`, juc.`permanent_add_country_id`, juc.`permanent_add_state_id`, juc.`permanent_add_district_id`, juc.`permanent_add_pincode` FROM `jos_users` ju LEFT JOIN (SELECT `user_id`, `salary`, `leave_balance`, `extra_hours_worked` FROM `jos_user_employee_details`) jued ON ju.`id` = jued.`user_id` LEFT JOIN (SELECT jucd.`id`, CONCAT('(', juc.`display_name`, ') ', jucd.`display_name`) AS user_category FROM `jos_user_categories` juc, `jos_user_category_details` jucd WHERE juc.`id` = jucd.`user_cat_id`) jucat ON ju.`user_subcat_id` = jucat.`id` LEFT JOIN (SELECT `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id` FROM `jos_user_personal_details`) jupd ON ju.`id` = jupd.`user_id`, `jos_user_contact` juc WHERE ju.`id` = ".$user_id." AND ju.`id` = juc.`user_id`");

		print jsonEncode($query);
	break;
}
?>