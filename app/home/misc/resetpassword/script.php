<?php
include "../../../assets/script/conf.php";

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
					ju.`id`, ju.`username`, ju_cat.`display_name` AS ucategory, ju.`display_name` as name,
					juc.`mobile_no`, juc.`email_id`,
					(UNIX_TIMESTAMP(ju.`created_on`) * 1000) AS created_on
				FROM
					`jos_users` ju,
					`jos_user_contact` juc,
					`jos_user_categories` ju_cat
				WHERE
					ju.`id` = juc.`user_id`
					AND ".implode(" AND ", $cond_ar)."
					AND ju.`user_cat_id` = ju_cat.`id`
				ORDER BY ju.`display_name`"
			);

			print jsonEncode($query);
		}
	break;

	case "resetpassword":
		$data = json_decode(file_get_contents("php://input"));

		$myid = $data->myid;
		$userid = $data->userid;

		$password = "password";

		$update_ju = mysql_query("UPDATE `jos_users` SET `tpassword` = '".$password."', `password` = '".md5($password)."', `modified_by` = ".$myid.", `modified_on` = NOW() WHERE `id` = ".$userid);

		if($update_ju) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>