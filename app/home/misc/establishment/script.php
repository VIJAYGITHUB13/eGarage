<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "details":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("SELECT `id`, `code`, `display_name` AS name, `address`, `contact`, `logo` FROM `jos_establishments` WHERE `id` = 1");

		print jsonEncode($query);
	break;

	case "logo":
		$data = json_decode(file_get_contents("php://input"));

		$logo = mysql_result(mysql_query("SELECT `logo` FROM `jos_establishments` WHERE `id` = 1"), 0);

		if($logo) {
			if(file_exists("images/".$logo)) {
				print $logo;
			}
		}
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);
		$displayname = trim($data->nameModel);
		$name = str_replace(" ", "_", strtolower($displayname));
		$address = trim($data->addressModel);
		$contact = trim($data->contactModel);

		$is_establishment_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_establishments`"), 0);

		$code_prefix = "ESTD";
		if($is_establishment_exists) {
			$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(je.`inc_id`, 3, '0')) AS code FROM (SELECT (SUBSTRING(`code`, ".(strlen($code_prefix) + 1).") + 1) AS inc_id FROM `jos_establishments` ORDER BY `code` DESC LIMIT 0, 1) je"), 0);
		} else {
			$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(1, 3, '0'))"), 0);
		}

		if($is_establishment_exists) {
			$update_je = mysql_query("UPDATE `jos_establishments` SET `name` = '".$name."', `display_name` = '".$displayname."', `address` = '".$address."', `contact` = '".$contact."', `modified_by` = ".$myid.", `modified_on` = NOW() WHERE `id` = 1");

			if($update_je) {
				print "SUCCESS";
			} else {
				print "ERROR_DB";
			}
		} else {
			$insert_je = mysql_query("INSERT INTO `jos_establishments` (`id`, `code`, `name`, `display_name`, `address`, `contact`, `logo`, `modified_by`, `modified_on`) VALUES (NULL, '".$code."', '".$name."', '".$displayname."', '".$address."', '".$contact."', '', ".$myid.", NOW())");

			if($insert_je) {
				print "SUCCESS";
			} else {
				print "ERROR_DB";
			}
		}
	break;

	case "upload":
		$path = "images/";
		$valid_formats_ar = array("jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "gif", "GIF", "bmp", "BMP");

		$name = $_FILES["image"]["name"];
		$size = $_FILES["image"]["size"];

		if(strlen($name)) {
			list($txt, $ext) = explode(".", $name);

			// File format check
			if(in_array($ext, $valid_formats_ar)) {
				// Max file limit (2MB) check
				if($size < 2098888) {
					$code = mysql_result(mysql_query("SELECT `code` FROM `jos_establishments` WHERE `id` = 1"), 0);
					$logo_name = $code."_".time().".".$ext;
					$tmp = $_FILES["image"]["tmp_name"];

					if(move_uploaded_file($tmp, $path.$logo_name)) {
						$existing_logo_name = mysql_result(mysql_query("SELECT `logo` FROM `jos_establishments` WHERE `id` = 1"), 0);
						$update_je = mysql_query("UPDATE `jos_establishments` SET `logo` = '".$logo_name."' WHERE `id` = 1");

						if($update_je) {
							unlink($path.$existing_logo_name);
							print "SUCCESS";
						} else {
							unlink($path.$logo_name);
							print "ERROR_DB";
						}
					}
					else { print "ERROR_UPLOAD"; }
				}
				else { print "ERROR_FILE_SIZE"; }
			}
			else { print "ERROR_FILE_FORMAT"; }
		}
		else { print "ERROR_NO_FILE"; }
	break;
}
?>