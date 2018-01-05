<?php
include "../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "signin":
		$data = json_decode(file_get_contents("php://input"));
		
		$uname = trim($data->uname);
		$pwd = trim($data->pwd);

		$is_blocked = mysql_result(mysql_query("SELECT `block` FROM `jos_users` WHERE `username` LIKE '".$uname."' AND `password` LIKE MD5('".$pwd."')"), 0);
		
		if($is_blocked == 1) {
			print "UNAUTHORISED";
		} else {
			$query = mysql_query("SELECT `id` AS uid, `username`, `display_name` AS uname, `user_cat_id` AS ucategory, `user_subcat_id` AS usubcategory FROM `jos_users` WHERE `block` = 0 AND `username` LIKE '".$uname."' AND `password` LIKE MD5('".$pwd."')");

			if(!$query) {
				print "ERROR_DB";
			} else if(mysql_num_rows($query)) {
				$json_encoded_obj = jsonEncode($query);
				$uid = json_decode($json_encoded_obj)[0]->uid;

				if($uid) {
					mysql_query("UPDATE `jos_users` SET `last_logged_on` = NOW(), `visiting_count` = (`visiting_count` + 1) WHERE `id` = ".$uid);
				}

				print $json_encoded_obj;
			} else {
				print "INVALID";
			}
		}
	break;

	case "signup":
		$data = json_decode(file_get_contents("php://input"));
		
		$uname = trim($data->uname);

		$fname = "";
		$lname = "";
		if(strpos($uname, " ")) {
			$fname = substr($uname, 0, strrpos($uname, " ") + 1);
			$lname = substr($uname, strrpos($uname, " ") + 1);
		} else {
			$fname = $uname;
		}

		$mobile_no = trim($data->mobile_no);
		$email_id = trim($data->email_id);
		$comments = trim($data->comments);
		
		$is_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_user_contact` WHERE `mobile_no` LIKE '%".$mobile_no."%' OR `email_id` LIKE '%".$email_id."%'"), 0);

		if($is_exists) {
			print "ALREADY_EXISTS";
		} else {
			$insert_ju = mysql_query("INSERT INTO `jos_users`(`id`, `user_cat_id`, `name`, `display_name`, `created_on`, `block`) VALUES (NULL, 5, '".str_replace(" ", "_", strtolower($uname))."', '".$uname."', NOW(), 1)");
			$last_inserted_id_ju = mysql_insert_id();

			$update_ju = mysql_query("UPDATE `jos_users` SET `created_by` = ".$last_inserted_id_ju." WHERE `id` = ".$last_inserted_id_ju);

			$insert_juc = mysql_query("INSERT INTO `jos_user_contact`(`id`, `user_id`, `mobile_no`, `email_id`) VALUES (NULL, ".$last_inserted_id_ju.", ".$mobile_no.", '".$email_id."')");

			$insert_jupd = mysql_query("INSERT INTO `jos_user_personal_details` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id`) VALUES (NULL, ".$last_inserted_id_ju.", '".$fname."', '".$lname."', '".$ngGenderMdl."', '', '', '', '', '', '', '')");

			if($insert_ju && $update_ju && $insert_juc && $insert_jupd) {
				print "SUCCESS";
			} else {
				print "ERROR_DB";
			}
		}
	break;
}
?>