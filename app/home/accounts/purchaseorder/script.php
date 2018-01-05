<?php
include "../../../../assets/script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "suppliers":
		$query = mysql_query("SELECT `id`, CONCAT('(', `code`, ') ', `display_name`) AS name FROM `jos_suppliers` ORDER BY `code`");

		print jsonEncode($query);
	break;

	case "storageitems":
		$query_storage_item_categories = mysql_query("SELECT `id`, CONCAT('(', `code`, ') ', `display_name`) AS name FROM `jos_storage_item_categories` ORDER BY `code`");
		$query_storage_item = mysql_query("SELECT `id`, `cat_id`, CONCAT('(', `code`, ') ', `display_name`) AS name FROM `jos_storage_items` ORDER BY `code`");
		
		print json_encode([json_decode(jsonEncode($query_storage_item_categories)), json_decode(jsonEncode($query_storage_item))]);
	break;

	case "paymentmodes":
		$query = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_storage_item_payment_modes` ORDER BY `display_name`");

		print jsonEncode($query);
	break;

	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$code = trim($data->code);
		$sup_id = trim($data->supID);
		$cat_id = trim($data->catID);
		$item_id = trim($data->itemID);
		$fdate = (trim($data->fdate) ? date("Y-m-d", strtotime(trim($data->fdate))) : "");
		$tdate = (trim($data->tdate) ? date("Y-m-d", strtotime(trim($data->tdate))) : "");

		$cond_ar = [];
		if($code) {
			array_push($cond_ar, "jsii.`code` LIKE '%".$code."%'");
		}

		if($sup_id) {
			array_push($cond_ar, "js.`id` = ".$sup_id);
		}

		if($cat_id) {
			array_push($cond_ar, "jsic.`id` = ".$cat_id);
		}

		if($item_id) {
			array_push($cond_ar, "jsi.`id` = ".$item_id);
		}

		if($fdate && $tdate) {
			array_push($cond_ar, "UNIX_TIMESTAMP('".$fdate." 00:00:00') <= UNIX_TIMESTAMP(jsii.`ordered_on`) AND UNIX_TIMESTAMP(jsii.`ordered_on`) <= UNIX_TIMESTAMP('".$tdate." 23:59:59')");
		}

		// MySQL: STR_TO_DATE: DD-MM-YYYY => YYYY-MM-DD
		// MySQL: DATE_FORMAT: YYYY-MM-DD => DD-MM-YYYY
		if(count($cond_ar)) {
			$query = mysql_query(
				"SELECT
					jsii.`id`,
					jsii.`code`,
					jsii.`total` AS purchased_total,
					js.`display_name` AS supplier,
					jsic.`display_name` AS category,
					jsi.`display_name` AS item,
					jsii.`quantity`,
					ju.`display_name` AS ordered_by,
					(UNIX_TIMESTAMP(jsii.`ordered_on`) * 1000) AS ordered_date
				FROM
					`jos_storage_item_invoices` jsii
					LEFT JOIN (SELECT `id`, `display_name` FROM `jos_users` ORDER BY `id`) ju ON jsii.`ordered_by` = ju.`id`,
					`jos_suppliers` js, `jos_storage_items` jsi,
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

	case "purchase":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$sup_id = $data->supID;
		$item_id = $data->itemID;
		$item_quantity = $data->itemQuantity;
		$item_purchasing_price = $data->itemPurchasingPrice;
		$item_service_tax = $data->itemServiceTax;
		$item_total = $data->itemTotal;
		$item_offer_price = $data->itemOfferPrice;

		$payment_mode = $data->paymentMode;
		$payment_date = (trim($data->paymentDate) ? date("Y-m-d", strtotime(trim($data->paymentDate))) : "");
		$cheque_no = $data->chequeNo;
		$payment_amount = $data->paymentAmount;

		$is_code_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_storage_item_invoices`"), 0);

		$code_prefix = "ORD";
		if($is_code_exists) {
			$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(js.`inc_id`, 5, '0')) AS code FROM (SELECT (SUBSTRING(`code`, ".(strlen($code_prefix) + 1).") + 1) AS inc_id FROM `jos_storage_item_invoices` ORDER BY `code` DESC LIMIT 0, 1) js"), 0);
		} else {
			$code = mysql_result(mysql_query("SELECT CONCAT('".$code_prefix."', LPAD(1, 5, '0'))"), 0);
		}

		$insert_jsii = mysql_query("INSERT INTO `jos_storage_item_invoices`(`id`, `code`, `sup_id`, `item_id`, `quantity`, `price`, `service_tax`, `total`, `offer_price`, `ordered_by`, `ordered_on`) VALUES (NULL, '".$code."', ".$sup_id.", ".$item_id.", ".$item_quantity.", ".$item_purchasing_price.", ".$item_service_tax.", ".$item_total.", ".$item_offer_price.", ".$myid.", '".$payment_date."')");
		$invoice_id = mysql_insert_id();

		$insert_jsip = mysql_query("INSERT INTO `jos_storage_item_payments`(`id`, `invoice_id`, `payment_mode`, `payment_date`, `cheque_no`, `payment_amount`, `paid_by`) VALUES (NULL, ".$invoice_id.", ".$payment_mode.", '".$payment_date."', ".$cheque_no.", ".$payment_amount.", ".$myid.")");

		$items_ar = [];
		for($i=0;$i<$item_quantity;$i++) {
			array_push($items_ar, "(NULL, ".$invoice_id.", ".($i+1).", 0)");
		}

		$insert_jsis = mysql_query("INSERT INTO `jos_storage_item_sold`(`id`, `invoice_id`, `quantity_count`, `is_sold`) VALUES ".implode(", ", $items_ar));

		if($insert_jsii && $insert_jsip && $insert_jsis) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "details":
		$data = json_decode(file_get_contents("php://input"));

		$invoice_id = $data->invoiceID;

		$query = mysql_query(
			"SELECT
				jsii.`id`,
				jsii.`code`,
				ju.`display_name` AS ordered_by,
				CONCAT('(', js.`code`, ') ', js.`display_name`) AS supplier,
				CONCAT('(', jsic.`code`, ') ', jsic.`display_name`) AS category,
				CONCAT('(', jsi.`code`, ') ', jsi.`display_name`) AS item,
				jsii.`quantity`,
				jsii.`price` AS purchased_price,
				jsii.`service_tax`,
				jsii.`total` AS total_purchased_price,
				(jsii.`total` / jsii.`quantity`) AS suggested_price,
				jsii.`offer_price` AS offered_price
			FROM
				`jos_storage_item_invoices` jsii
				LEFT JOIN (SELECT `id`, `display_name` FROM `jos_users` ORDER BY `id`) ju ON jsii.`ordered_by` = ju.`id`,
				`jos_suppliers` js, `jos_storage_items` jsi,
				`jos_storage_item_categories` jsic
			WHERE
				jsii.`id` = ".$invoice_id."
				AND jsii.`sup_id` = js.`id`
				AND jsii.`item_id` = jsi.`id`
				AND jsi.`cat_id` = jsic.`id`");

		print jsonEncode($query);
	break;

	case "paymenthistory":
		$data = json_decode(file_get_contents("php://input"));

		$invoice_id = $data->invoiceID;

		$query = mysql_query(
			"SELECT
				jsip.`invoice_id`,
				IF(jsip.`payment_mode` = 2, CONCAT(jsipm.`display_name`, ' (', jsip.`cheque_no`, ')'), jsipm.`display_name`) AS payment_mode,
				(UNIX_TIMESTAMP(jsip.`payment_date`) * 1000) AS paid_date,
				jsip.`payment_amount` AS paid_amount,
				ju.`display_name` AS paid_by
			FROM 
				`jos_storage_item_payments` jsip
				LEFT JOIN (SELECT `id`, `display_name` FROM `jos_users` ORDER BY `id`) ju ON jsip.`paid_by` = ju.`id`,
				`jos_storage_item_payment_modes` jsipm
			WHERE
				jsip.`invoice_id` = ".$invoice_id."
				AND jsip.`payment_mode` = jsipm.`id`
			ORDER BY UNIX_TIMESTAMP(jsip.`payment_date`) ASC, jsip.`id` ASC");

		print jsonEncode($query);
	break;

	case "makepayment":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);
		$invoice_id = $data->invoiceID;
		$payments_ar = $data->paymentsAr;

		$values_ar = [];
		foreach($payments_ar as $key => $payment_obj) {
			$payment_mode = $payment_obj->paymentMode;
			$cheque_no = $payment_obj->chequeNo;
			$payment_date = (trim($payment_obj->paymentDate) ? date("Y-m-d", strtotime(trim($payment_obj->paymentDate))) : "");
			$payment_amount = $payment_obj->paymentAmount;

			array_push($values_ar, "(NULL, ".$invoice_id.", ".$payment_mode.", ".$cheque_no.", '".$payment_date."', ".$payment_amount.", ".$myid.")");
		}

		$insert_jsip = mysql_query("INSERT INTO `jos_storage_item_payments`(`id`, `invoice_id`, `payment_mode`, `cheque_no`, `payment_date`, `payment_amount`, `paid_by`) VALUES ".implode(", ", $values_ar));

		if($insert_jsip) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>