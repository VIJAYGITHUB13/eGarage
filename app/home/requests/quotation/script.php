<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "storageitems":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query(
			"SELECT
				jsic.`id` AS item_cat_id, jsic.`code` AS item_cat_code, jsic.`display_name` AS item_cat_name,
				jsi.`id` AS item_id, jsi.`code` AS item_code, jsi.`display_name` AS item,
				jsii.`code` AS invoice, jsii.`offer_price` AS price,
				jsis.`id` AS item_quantity_id, jsis.`quantity_count`
			FROM
				`jos_storage_item_categories` jsic,
				`jos_storage_items` jsi,
				`jos_storage_item_invoices` jsii,
				`jos_storage_item_sold` jsis
			WHERE
				jsic.`id` = jsi.`cat_id`
				AND jsi.`id` = jsii.`item_id`
				AND UNIX_TIMESTAMP(NOW()) >= UNIX_TIMESTAMP(jsii.`ordered_on`)
				AND jsii.`id` = jsis.`invoice_id`
				AND jsis.`is_sold` = 0
			GROUP BY jsi.`id`, jsii.`id`, jsis.`id`
			ORDER BY jsi.`id`, jsii.`id`, jsis.`quantity_count`");

		print jsonEncode($query);
	break;
}
?>