<?php
include "../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "details":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$query = mysql_query("SELECT `id`, `display_name` AS name, `username` FROM `jos_users` WHERE `id` = ".$myid);

		print jsonEncode($query);
	break;

	case "changepassword":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);
		$password = trim($data->passwordModel);

		$update_ju = mysql_query("UPDATE `jos_users` SET `tpassword` = '".$password."', `password` = '".md5($password)."', `modified_by` = ".$myid.", `modified_on` = NOW() WHERE `id` = ".$myid);
		
		if($update_ju) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>