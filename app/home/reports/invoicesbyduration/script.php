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
			array_push($cond_ar, "UNIX_TIMESTAMP('".$fdate." 00:00:00') <= UNIX_TIMESTAMP(jr.`modified_on`) AND UNIX_TIMESTAMP(jr.`modified_on`) <= UNIX_TIMESTAMP('".$tdate." 23:59:59')");
		}

		// MySQL: STR_TO_DATE: DD-MM-YYYY => YYYY-MM-DD
		// MySQL: DATE_FORMAT: YYYY-MM-DD => DD-MM-YYYY
		if(count($cond_ar)) {
			$query = mysql_query(
				"SELECT
					jr.`id`, jr.`request_id`,
					CONCAT('(', juclient.`username`, ') ', juclient.`display_name`) AS client,
					(UNIX_TIMESTAMP(jr.`created_on`) * 1000) AS created_on,
					(UNIX_TIMESTAMP(jr.`modified_on`) * 1000) AS closed_on,
					jrj.`total`
				FROM
					`jos_requests` jr
					LEFT JOIN (SELECT `req_id`, SUM(`item_total`) AS total FROM `jos_req_jobs` GROUP BY `req_id` ORDER BY `req_id`) jrj
						ON jr.`id` = jrj.`req_id`
					LEFT JOIN (SELECT `id`, `username`, `display_name` FROM `jos_users`) juclient
						ON jr.`client_id` = juclient.`id`
				WHERE
					jr.`status_id` = 3 AND ".implode(" AND ", $cond_ar)."
				GROUP BY UNIX_TIMESTAMP(jr.`modified_on`) DESC"
			);

			print jsonEncode($query);
		}
	break;
}
?>