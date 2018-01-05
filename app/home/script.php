<?php
include "../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "appdetails":
		$query = mysql_query("SELECT `display_name` AS app_name, `acronym` AS app_band, `version` AS app_version FROM `jos_app` WHERE `id` = 1");
		
		print jsonEncode($query);
	break;

	case "estddetails":
		$query = mysql_query("SELECT `code`, `display_name` AS name, `address`, `contact`, `logo` FROM `jos_establishments` WHERE `id` = 1");
		
		print jsonEncode($query);
	break;

	case "menus":
		$data = json_decode(file_get_contents("php://input"));

		$usubcategory = $data->usubcategory;

		$query = mysql_query("SELECT jm.`id`, jm.`parent_id`, jm.`display_name`, jm.`path`, jm.`rwd` FROM `jos_menus` jm, `jos_menus_ucategories` jmc WHERE jm.`envi` = 1 AND jmc.`user_subcat_id` = ".$usubcategory." AND jm.`id` = jmc.`menu_id` GROUP BY jm.`id` ORDER BY jm.`display_order` ASC");

		// Ref: http://stackoverflow.com/questions/4452472/category-hierarchy-php-mysql
		// Ref: http://blog.ideashower.com/post/15147134343/create-a-parent-child-array-structure-in-one-pass
		$refs = array();
		$list = array();

		while($data = @mysql_fetch_assoc($query)) {
			$thisref = &$refs[ $data["id"] ];

			$thisref["parent_id"] = $data["parent_id"];
			$thisref["display_name"] = $data["display_name"];
			$thisref["path"] = $data["path"];
			$thisref["rwd"] = $data["rwd"];

			if($data["parent_id"] == 0) {
				$list[] = &$thisref;
			} else {
				$refs[ $data["parent_id"] ]["subMenusAr"][] = &$thisref;
			}
		}

		print json_encode($list);
	break;
}
?>