<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "ucategories":
		$query = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_user_categories` ORDER BY `id`");
		
		print jsonEncode($query);
	break;

	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$ucategory = trim($data->ucategory);
		$uname = trim($data->uname);
		$fdate = (trim($data->fdate) ? date("Y-m-d", strtotime(trim($data->fdate))) : "");
		$tdate = (trim($data->tdate) ? date("Y-m-d", strtotime(trim($data->tdate))) : "");

		$cond_ar = [];
		if($ucategory) {
			array_push($cond_ar, "ju.`user_cat_id` = '".$ucategory."'");
		}

		if($uname) {
			array_push($cond_ar, "ju.`display_name` LIKE '%".$uname."%'");
		}

		if($fdate && $tdate) {
			array_push($cond_ar, "UNIX_TIMESTAMP('".$fdate." 00:00:00') <= UNIX_TIMESTAMP(ju.`created_on`) AND UNIX_TIMESTAMP(ju.`created_on`) <= UNIX_TIMESTAMP('".$tdate." 23:59:59')");
		}

		// MySQL: STR_TO_DATE: DD-MM-YYYY => YYYY-MM-DD
		// MySQL: DATE_FORMAT: YYYY-MM-DD => DD-MM-YYYY
		if(count($cond_ar)) {
			$query = mysql_query(
				"SELECT
					ju.`id`, ju.`username`, jucat.`user_category` AS ucategory, ju.`display_name` as name,
					juc.`mobile_no`, juc.`email_id`,
					(UNIX_TIMESTAMP(ju.`created_on`) * 1000) AS created_on, ju.`block` AS is_blocked
				FROM
					`jos_users` ju
					LEFT JOIN
					(SELECT
						jucd.`id`, CONCAT('(', juc.`display_name`, ') ', jucd.`display_name`) AS user_category
						FROM `jos_user_categories` juc, `jos_user_category_details` jucd
						WHERE juc.`id` = jucd.`user_cat_id`) jucat
					ON ju.`user_subcat_id` = jucat.`id`, `jos_user_contact` juc
				WHERE ju.`id` = juc.`user_id` AND ".implode(" AND ", $cond_ar)."
				ORDER BY ju.`display_name`"
			);

			print jsonEncode($query);
		}
	break;

	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$ucategory = trim($data->ucategory);
		$uname = trim($data->uname);
		$fdate = (trim($data->fdate) ? date("Y-m-d", strtotime(trim($data->fdate))) : "");
		$tdate = (trim($data->tdate) ? date("Y-m-d", strtotime(trim($data->tdate))) : "");

		$ucategory_cond = "";
		$uname_cond = "";
		$date_cond = "";

		($ucategory ? ($ucategory_cond = ("AND ju.`user_cat_id` = '".$ucategory."'")) : ($ucategory_cond = ""));
		($uname ? ($uname_cond = ("AND ju.`display_name` LIKE '%".$uname."%'")) : ($uname_cond = ""));
		(($fdate && $tdate) ? ($date_cond = ("AND ju.`created_on` BETWEEN '".$fdate."' AND '".$tdate."'")) : ($date_cond = ""));

		$cond = trim($ucategory_cond." ".$uname_cond." ".$date_cond);
		
		// MySQL: STR_TO_DATE: DD-MM-YYYY => YYYY-MM-DD
		// MySQL: DATE_FORMAT: YYYY-MM-DD => DD-MM-YYYY
		if($cond) {
			$query = mysql_query("SELECT ju.`id`, ju.`username`, jucat.`user_category` AS ucategory, ju.`display_name` as name, juc.`mobile_no`, juc.`email_id`, (UNIX_TIMESTAMP(ju.`created_on`) * 1000) AS created_on, ju.`block` AS is_blocked FROM `jos_users` ju LEFT JOIN (SELECT jucd.`id`, CONCAT('(', juc.`display_name`, ') ', jucd.`display_name`) AS user_category FROM `jos_user_categories` juc, `jos_user_category_details` jucd WHERE juc.`id` = jucd.`user_cat_id`) jucat ON ju.`user_subcat_id` = jucat.`id`, `jos_user_contact` juc WHERE ju.`id` = juc.`user_id` ".$cond." ORDER BY ju.`display_name`");

			print jsonEncode($query);
		}
	break;

	case "block":
		$data = json_decode(file_get_contents("php://input"));

		$user_id = $data->userID;

		$query = mysql_query("UPDATE `jos_users` SET `block` = 1 WHERE `id` = ".$user_id);

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "unblock":
		$data = json_decode(file_get_contents("php://input"));

		$user_id = $data->userID;

		$query = mysql_query("UPDATE `jos_users` SET `block` = 0 WHERE `id` = ".$user_id);

		if($query) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>