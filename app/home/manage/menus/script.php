<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "usercategories":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("SELECT juc.`id` AS user_category_id, jucd.`id` AS user_subcategory_id, juc.`display_name` AS user_category, jucd.`display_name` AS user_subcategory FROM `jos_user_categories` juc,  `jos_user_category_details` jucd WHERE juc.`id` = jucd.`user_cat_id` ORDER BY juc.`id`, jucd.`display_order`");

		print jsonEncode($query);
	break;

	case "menus":
		$data = json_decode(file_get_contents("php://input"));

		$usubcategory = $data->userSubcategory;

		$query = mysql_query("SELECT jmp.`id` AS parent_id, jmp.`display_name` AS parent_menu, IF((jmu.`id` IS NULL), 'false', 'true') AS parent_selected, jmc.`id` AS child_id, jmc.`display_name` AS child_menu, jmc.`selected` AS child_selected FROM `jos_menus` jmp LEFT JOIN (SELECT `id`, `menu_id` FROM `jos_menus_ucategories` WHERE `user_subcat_id` = ".$usubcategory.") jmu ON jmp.`id` = jmu.`menu_id` LEFT JOIN (SELECT jm.`id`, jm.`parent_id`, jm.`display_name`, IF((jmu.`id` IS NULL), 'false', 'true') AS selected FROM `jos_menus` jm LEFT JOIN (SELECT `id`, `menu_id` FROM `jos_menus_ucategories` WHERE `user_subcat_id` = ".$usubcategory.") jmu ON jm.`id` = jmu.`menu_id` WHERE jm.`envi` = 1 AND jm.`parent_id` != 0 ORDER BY jm.`display_order`) jmc ON jmp.`id` = jmc.`parent_id` WHERE jmp.`envi` = 1 AND jmp.`parent_id` = 0 ORDER BY jmp.`display_order`");

		print jsonEncode($query);
	break;

	case "assign":
		$data = json_decode(file_get_contents("php://input"));

		$usubcategory = $data->userSubcategory;
		$menus_ar = $data->menusAr;

		$counter = 0;
		foreach($menus_ar as $key => $menu_obj) {
			$menu_id = $menu_obj->menuID;
			$selected = $menu_obj->selected;

			$is_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_menus_ucategories` WHERE `user_subcat_id` = ".$usubcategory." AND `menu_id` = ".$menu_id), 0);

			if($selected) {
				if(!$is_exists) {
					$query = mysql_query("INSERT INTO `jos_menus_ucategories` (`id`, `user_subcat_id`, `menu_id`) VALUES (NULL, ".$usubcategory.", ".$menu_id.")");

					if($query) {
						$counter++;
					}
				} else {
					$counter++;
				}
			} else if(!$selected) {
				if($is_exists) {
					$query = mysql_query("DELETE FROM `jos_menus_ucategories` WHERE `user_subcat_id` = ".$usubcategory." AND `menu_id` = ".$menu_id);

					if($query) {
						$counter++;
					}
				} else {
					$counter++;
				}
			}
		}

		if(count($menus_ar) == $counter) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>