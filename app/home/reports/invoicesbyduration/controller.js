(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("invoicesByDurationCtrl", invoicesByDurationCtrl);
	invoicesByDurationCtrl.$inject = [
		"$scope",
		"$state",
		"$sce",
		"$filter",
		"dpConfFactory",
		"restAPIFactory",
		"isArResFactory"
	];

	function invoicesByDurationCtrl($scope, $state, $sce, $filter, dpConfFactory, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.reportsRESTData = {};
			$scope.reportsFormData = {};
			$scope.reportsSbmtData = {};

			$scope.reportsRESTData.termsAr = [];

			$scope.reportsSbmtData.totalObj = {};
			$scope.reportsSbmtData.totalObj.total = 0;

			dpConfFactory.format = "DD-MM-YYYY";
			$scope.dateTimePickerConf = JSON.stringify(dpConfFactory);

			$scope.infoObj = {};
			$scope.infoObj.msg = "Please apply the filter.";
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		// <<=

		// Behaviours of the page =>>
		// ==========================
		// Automated methods >>
		$(function() {
			setTimeout(function() {
				var $fdate = $("#fdate");
				var $tdate = $("#tdate");

				var datetimepickerOptions = JSON.parse($fdate.attr("datetimepicker-options"));

				$fdate.datetimepicker(datetimepickerOptions);
				$tdate.datetimepicker(function() {
					var obj = datetimepickerOptions;
					obj.useCurrent = false;
					return obj;
				});

				$fdate.on("dp.change", function (e) {
					$('#tdate').data("DateTimePicker").minDate(e.date);
				});

				$tdate.on("dp.change", function (e) {
					$('#fdate').data("DateTimePicker").maxDate(e.date);
				});
			}, 100);
		});

		$scope.filterData = function(inputAr, inputKey, inputVal) {
			if(inputAr !== undefined) {
				return inputAr.filter(function(obj) {
					return (obj[inputKey] === inputVal);
				});
			} else {
				return [];
			}
		};
		// <<

		$scope.searchFormSubmit = function() {
			$scope.infoObj.msg = "Please wait...";
			$scope.tbodyAr = [];

			restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
				if(jsonData.statusText === "OK") {
					$scope.theadAr = jsonData.data[0].invoicesByDurationTHeadAr;

					var url = $scope.basePath;
					url += "script.php?task=view";
					var inputObj = {
						fdate: ($scope.reportsSbmtData.fdateModel || ""),
						tdate: ($scope.reportsSbmtData.tdateModel || "")
					};

					if(!Object.keys(inputObj).filter(function(key){ return ("" + inputObj[key]); }).length) {
						$scope.infoObj.msg = "Please apply the filter.";
					} else {
						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							if(responseData.statusText === "OK") {
								if(isArResFactory(responseData)) {
									$scope.infoObj.msg = "";

									var responseAr = [];
									var total = 0;
									angular.forEach(responseData.data, function(obj) {
										var invoiceObj = {
											id: ((obj.id && parseInt(obj.id)) || 0),
											requestID: obj.request_id,
											client: obj.client,
											createdOn: obj.created_on,
											closedOn: obj.closed_on,
											total: $filter("toDecimal", 2)(obj.total)
										};

										responseAr.push(invoiceObj);

										total += invoiceObj.total;
									});
									angular.copy(responseAr, $scope.tbodyAr);

									$scope.reportsSbmtData.totalObj.total = $filter("toDecimal", 2)(total);

									$scope.orderBy = "closedOn";
									$scope.orderByDir = true;
									$scope.sortColumn = function(code) {
										$scope.orderBy = code;
										$scope.orderByDir = !$scope.orderByDir;
									};
								} else {
									$scope.infoObj.msg = "No records found.";
								}
							} else {
								$scope.infoObj.msg = "Something went wrong.";
							}
						});
					}
				} else {
					$scope.infoObj.msg = "Something went wrong.";
				}
			});
		};

		$scope.printReportTitle = function() {
			var obj = {
				fdate: ($scope.reportsSbmtData.fdateModel || ""),
				tdate: ($scope.reportsSbmtData.tdateModel || "")
			};

			var printReportTitleAr = [];

			if(obj.fdate && obj.tdate) {
				var tpl = '';
				tpl += '<strong>Dates between</strong>';
				tpl += (' ' + obj.fdate);
				tpl += ' <strong>and</strong>';
				tpl += (' ' + obj.tdate);
				printReportTitleAr.push(tpl);
			}

			var printReportTitle = '';
			printReportTitle += '<span class="glyphicon glyphicon-tag" style="margin-right: 5px;"></span>';
			printReportTitle += printReportTitleAr.join('<span class="glyphicon glyphicon-tag" style="margin-left: 25px; margin-right: 5px;"></span>');
			printReportTitle += '<strong class="pull-right">Dated: ' + $filter("date")((new Date()), "dd-MM-yyyy") + '</strong>';

			return $sce.trustAsHtml(printReportTitle);
		}

		$scope.printReport = function() {
			var tpl = document.getElementById("home_manage_reports_container_print").innerHTML;
			var popUp = window.open("", "_blank", "fullscreen=yes, height=700, scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no");
			popUp.document.open();

			var pdfTpl = '';
			pdfTpl += '<html>';
				pdfTpl += '<head>';
					pdfTpl += '<title>eGarage_Reports_InvoicesByTerms</title>';
					pdfTpl += '<link href="assets/css/lib/bootstrap.min.css" rel="stylesheet" />';
					pdfTpl += '<link rel="stylesheet" type="text/css" href="assets/css/custom/style.css" />';
				pdfTpl += '</head>';
				pdfTpl += '<body onload="window.print()">' + tpl + '</body>';
			pdfTpl += '</html>';

			popUp.document.write(pdfTpl);
			popUp.document.close();
		};
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		$scope.reset = function() {
			$state.go($state.current, {}, { reload: true });
		};
		// <<=
	}
})();