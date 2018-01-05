<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$fdate = (trim($data->fdate) ? date("Y-m-d", strtotime(trim($data->fdate))) : "");
		$tdate = (trim($data->tdate) ? date("Y-m-d", strtotime(trim($data->tdate))) : "");

		$cond_ar = [];
		if($fdate && $tdate) {
			array_push($cond_ar, "UNIX_TIMESTAMP('".$fdate." 00:00:00') <= UNIX_TIMESTAMP(jsii.`ordered_on`) AND UNIX_TIMESTAMP(jsii.`ordered_on`) <= UNIX_TIMESTAMP('".$tdate." 23:59:59')");
		}

		// MySQL: STR_TO_DATE: DD-MM-YYYY => YYYY-MM-DD
		// MySQL: DATE_FORMAT: YYYY-MM-DD => DD-MM-YYYY
		if(count($cond_ar)) {
			$query = mysql_query(
				"SELECT
					jsii.`id`, jsii.`code`,
					CONCAT('(', js.`code`, ') ', js.`display_name`) AS supplier,
					CONCAT('(', jsic.`code`, ') ', jsic.`display_name`) AS category,
					CONCAT('(', jsi.`code`, ') ', jsi.`display_name`) AS item,
					jsii.`quantity` AS purchased_quantity,
					jsii.`total` AS purchased_total,
					IFNULL(jr.`total_sold_quantity`, 0) AS sold_quantity,
					IFNULL(jr.`total_sold_price`, 0) AS sold_total,
					(UNIX_TIMESTAMP(jsii.`ordered_on`) * 1000) AS ordered_date,
					jsip.`paid_amount`,
					(jsii.`total` - jsip.`paid_amount`) AS due_amount
				FROM
					`jos_storage_item_invoices` jsii
					LEFT JOIN
						(SELECT
							jr.`invoice_id`,
							COUNT(jr.`is_sold_id`) AS total_sold_quantity,
							SUM(jr.`item_sold_price`) AS total_sold_price
						FROM
							(SELECT
								jr.`id` AS request_id,
								jrj.`id` AS req_job_id,
								jsis.`id` AS is_sold_id,
								jsis.`invoice_id`,
								jsii.`offer_price`,
								(SUM(jsii.`offer_price`) - (SUM(jsii.`offer_price`) * (jrj.`item_discount` * 0.01))) AS item_sold_price
							FROM
								`jos_requests` jr,
								`jos_req_jobs` jrj,
								`jos_storage_item_sold` jsis,
								`jos_storage_item_invoices` jsii
							WHERE
								jr.`status_id` = 3
								AND jr.`id` = jrj.`item_id`
								AND FIND_IN_SET(jsis.`id`, jrj.`item_quantity_details`)
								AND jsis.`invoice_id` = jsii.`id`
							GROUP BY jsii.`id`, jsis.`id`) jr
						GROUP BY jr.`invoice_id`) jr
					ON jsii.`id` = jr.`invoice_id`
					LEFT JOIN
						(SELECT
							`invoice_id`,
							SUM(`payment_amount`) AS paid_amount
						FROM `jos_storage_item_payments`
						GROUP BY `invoice_id`) jsip
					ON jsii.`id` = jsip.`invoice_id`,
					`jos_suppliers` js,
					`jos_storage_items` jsi,
					`jos_storage_item_categories` jsic
				WHERE
					jsii.`sup_id` = js.`id`
					AND jsii.`item_id` = jsi.`id`
					AND jsi.`cat_id` = jsic.`id`
					AND ".implode(" AND ", $cond_ar)."
				ORDER BY UNIX_TIMESTAMP(jsii.`ordered_on`) DESC");

			print jsonEncode($query);
		}
	break;
}
?>