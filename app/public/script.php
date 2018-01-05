<?php
include "../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "app_details":
		$query = mysql_query("SELECT `display_name` AS app_name, `acronym` AS app_band, `version` AS app_version FROM `jos_app` WHERE `id` = 1");
		
		print jsonEncode($query);
	break;

	case "menus":
		$query = mysql_query("SELECT `id`, `parent_id`, `display_name`, `path` FROM `jos_menus` WHERE `envi` = 0 ORDER BY `display_order` ASC");

		// Ref: http://stackoverflow.com/questions/4452472/category-hierarchy-php-mysql
		// Ref: http://blog.ideashower.com/post/15147134343/create-a-parent-child-array-structure-in-one-pass
		$refs = array();
		$list = array();

		while($data = @mysql_fetch_assoc($query)) {
			$thisref = &$refs[ $data["id"] ];

			$thisref["parent_id"] = $data["parent_id"];
			$thisref["display_name"] = $data["display_name"];
			$thisref["path"] = $data["path"];

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