(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("ordersCtrl", ordersCtrl);
	ordersCtrl.$inject = [
		"$scope",
		"$state",
		"$sce",
		"$filter",
		"dpConfFactory",
		"paginationConfFactory",
		"restAPIFactory",
		"isArResFactory"
	];

	function ordersCtrl($scope, $state, $sce, $filter, dpConfFactory, paginationConfFactory, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.reportsRESTData = {};
			$scope.reportsFormData = {};
			$scope.reportsSbmtData = {};

			$scope.reportsRESTData.suppliersAr = [];
			$scope.reportsRESTData.storageItemCatsAr = [];
			$scope.reportsRESTData.storageItemsAr = [];

			$scope.reportsSbmtData.totalObj = {};
			$scope.reportsSbmtData.totalObj.totalInitQuantity = 0;
			$scope.reportsSbmtData.totalObj.totalCurrentQuantity = 0;
			$scope.reportsSbmtData.totalObj.totalBillPrice = 0;
			$scope.reportsSbmtData.totalObj.totalInstalledTotal = 0;
			$scope.reportsSbmtData.totalObj.totalPaidAmount = 0;
			$scope.reportsSbmtData.totalObj.totalDueAmount = 0;

			dpConfFactory.format = "DD-MM-YYYY";
			$scope.dateTimePickerConf = JSON.stringify(dpConfFactory);
			$scope.noofPages = paginationConfFactory.noofPages;
			$scope.currentPage = paginationConfFactory.currentPage;

			$scope.infoObj = {};
			$scope.infoObj.msg = "Please apply the filter.";
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		var url = $scope.basePath;
		url += "script.php?task=suppliers";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					var responseAr = [];
					angular.forEach(responseData.data, function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.reportsRESTData.suppliersAr);
				}
			}
		});

		var url = $scope.basePath;
		url += "script.php?task=storageitems";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					// Storage Item Categories >>
					var responseAr = [];
					angular.forEach(responseData.data[0], function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.reportsRESTData.storageItemCatsAr);
					// <<

					// Storage Item >>
					var responseAr = [];
					angular.forEach(responseData.data[1], function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							catID: parseInt(obj.cat_id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.reportsRESTData.storageItemsAr);
					// <<
				}
			}
		});
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
					$scope.theadAr = jsonData.data[0].ordersTHeadAr;

					var url = $scope.basePath;
					url += "script.php?task=view";
					var inputObj = {
						supID: ($scope.reportsSbmtData.supIDModel || 0),
						catID: ($scope.reportsSbmtData.catIDModel || 0),
						itemID: ($scope.reportsSbmtData.itemIDModel || 0),
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
									var totalPurchasedQuantity = 0;
									var totalSoldQuantity = 0;
									var totalPurchasedTotal = 0;
									var totalSoldTotal = 0;
									var totalPaidAmount = 0;
									var totalDueAmount = 0;
									angular.forEach(responseData.data, function(obj) {
										var invoiceObj = {
											id: ((obj.id && parseInt(obj.id)) || 0),
											code: obj.code,
											supplier: obj.supplier,
											category: obj.category,
											item: obj.item,
											purchasedQuantity: ((obj.purchased_quantity && parseInt(obj.purchased_quantity)) || 0),
											purchasedTotal: ((obj.purchased_total && parseFloat(obj.purchased_total)) || 0),
											soldQuantity: ((obj.sold_quantity && parseInt(obj.sold_quantity)) || 0),
											soldTotal: ((obj.paid_amount && $filter("toDecimal", 2)(obj.sold_total)) || 0),
											cssBorderColor: obj.css_border_color,
											orderedDate: obj.ordered_date,
											paidAmount: ((obj.paid_amount && parseFloat(obj.paid_amount)) || 0),
											dueAmount: ((obj.due_amount && $filter("toDecimal", 2)(obj.due_amount)) || 0)
										};

										responseAr.push(invoiceObj);

										totalPurchasedQuantity += invoiceObj.purchasedQuantity;
										totalSoldQuantity += invoiceObj.soldQuantity;
										totalPurchasedTotal += invoiceObj.purchasedTotal;
										totalSoldTotal += invoiceObj.soldTotal;
										totalPaidAmount += invoiceObj.paidAmount;
										totalDueAmount += invoiceObj.dueAmount;
									});
									angular.copy(responseAr, $scope.tbodyAr);

									$scope.reportsSbmtData.totalObj.totalPurchasedQuantity = totalPurchasedQuantity;
									$scope.reportsSbmtData.totalObj.totalSoldQuantity = totalSoldQuantity;
									$scope.reportsSbmtData.totalObj.totalPurchasedTotal = $filter("toDecimal", 2)(totalPurchasedTotal);
									$scope.reportsSbmtData.totalObj.totalSoldTotal = $filter("toDecimal", 2)(totalSoldTotal);
									$scope.reportsSbmtData.totalObj.totalPaidAmount = $filter("toDecimal", 2)(totalPaidAmount);
									$scope.reportsSbmtData.totalObj.totalDueAmount = $filter("toDecimal", 2)(totalDueAmount);

									$scope.orderBy = "orderedDate";
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
				supID: ($scope.reportsSbmtData.supIDModel || 0),
				catID: ($scope.reportsSbmtData.catIDModel || 0),
				itemID: ($scope.reportsSbmtData.itemIDModel || 0),
				fdate: ($scope.reportsSbmtData.fdateModel || ""),
				tdate: ($scope.reportsSbmtData.tdateModel || "")
			};

			var printReportTitleAr = [];

			if(obj.supID) {
				var tpl = '';
				tpl += '<strong>Supplier: </strong>';
				tpl += $scope.filterData($scope.reportsRESTData.suppliersAr, "id", obj.supID)[0].name;
				printReportTitleAr.push(tpl);
			}

			if(obj.catID) {
				var tpl = '';
				tpl += '<strong>Category: </strong>';
				tpl += $scope.filterData($scope.reportsRESTData.storageItemCatsAr, "id", obj.catID)[0].name;
				printReportTitleAr.push(tpl);
			}

			if(obj.itemID) {
				var tpl = '';
				tpl += '<strong>Item: </strong>';
				tpl += $scope.filterData($scope.reportsRESTData.storageItemCatsAr, "id", obj.itemID)[0].name;
				printReportTitleAr.push(tpl);
			}

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

			return $sce.trustAsHtml(printReportTitle);
		}

		$scope.printReport = function() {
			var tpl = document.getElementById("home_manage_reports_container_print").innerHTML;
			var popUp = window.open("", "_blank", "fullscreen=yes, height=700, scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no");
			popUp.document.open();

			var pdfTpl = '';
			pdfTpl += '<html>';
				pdfTpl += '<head>';
					pdfTpl += '<title>eGarage_Reports_Orders</title>';
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