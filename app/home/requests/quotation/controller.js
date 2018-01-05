(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("requestQuotationCtrl", requestQuotationCtrl);
	requestQuotationCtrl.$inject = [
		"$scope",
		"$state",
		"$filter",
		"$sce",
		"dpConfFactory",
		"userInfoService",
		"infoMessagesFactory",
		"alertInfoService",
		"restAPIFactory",
		"isArResFactory",
		"requestDetailsService"
	];

	function requestQuotationCtrl($scope, $state, $filter, $sce, dpConfFactory, userInfoService, infoMessagesFactory, alertInfoService, restAPIFactory, isArResFactory, requestDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.reqQuotationRESTData = {};
			// $scope.reqQuotationFormData = {};
			$scope.reqQuotationSbmtData = {};

			$scope.reqQuotationRESTData.storageItemDetailsAr = [];
			$scope.reqQuotationRESTData.storageItemsAr = [];

			$scope.reqQuotationSbmtData.jobsAr = [];
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		function getStorageItems() {
			var url = $scope.basePath;
			url += "script.php?task=storageitems";

			restAPIFactory("GET", url, {}).post(function(responseData) {
				if(responseData.statusText === "OK") {
					if(isArResFactory(responseData)) {
						var responseAr = [];
						angular.forEach(responseData.data, function(obj) {
							responseAr.push({
								itemCatID: parseInt(obj.item_cat_id),
								itemCatCode: obj.item_cat_code,
								itemCatName: obj.item_cat_name,
								itemID: obj.item_id,
								itemCode: obj.item_code,
								item: obj.item,
								invoice: obj.invoice,
								price: ((obj.price && $filter("toDecimal")(obj.price)) || 0),
								itemQuantityID: parseInt(obj.item_quantity_id),
								quantityCount: parseInt(obj.quantity_count)
							});
						});

						angular.copy(getStorageItemsAr(responseAr), $scope.reqQuotationRESTData.storageItemsAr);
						angular.copy(responseAr, $scope.reqQuotationRESTData.storageItemDetailsAr);
						addRow();
					}
				}
			});
		}
		getStorageItems();

		function getStorageItemsAr(inputAr) {
			var storageItemsAr = [];
			angular.forEach(inputAr, function(obj) {
				if(!$scope.filterData(storageItemsAr, "id", obj.itemID).length) {
					storageItemsAr.push({
						catID: obj.itemCatID,
						catCode: obj.itemCatCode,
						cat: obj.itemCatName,
						id: obj.itemID,
						code: obj.itemCode,
						name: obj.item,
						isItemQuantity: true
					});
				}
			});

			return storageItemsAr;
		}
		// <<=

		// Behaviours of the page =>>
		// ==========================
		// Automated methods >>
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

		$scope.removeRow = function(ind) {
			var msg = "Are you sure? The entered data for the row will be lost.";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Remove Row",
						className: "btn-warning"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						$scope.reqQuotationSbmtData.jobsAr.splice(ind, 1);
						$scope.refreshStorageItems();
					}
				}
			});
		};

		function addRow() {
			var obj = {
				storageItemsAr: $scope.reqQuotationRESTData.storageItemsAr,
				itemID: "",
				item: "",
				itemPrice: 0,
				itemQuantity: 0,
				itemMaxQuantity: 0,
				itemQuantityDetails: [],
				itemDiscount: 0,
				itemTotal: 0,
				serviceCharge: 0,
				vat: 0,
				total: 0
			};

			$scope.reqQuotationSbmtData.jobsAr.push(obj);
		}
		$scope.addRow = addRow;

		$scope.refreshStorageItems = function() {
			var maxQuantityObj = {};
			angular.forEach($scope.reqQuotationSbmtData.jobsAr, function(obj) {
				if(obj.itemID) {
					((maxQuantityObj[obj.itemID] === undefined) && (maxQuantityObj[obj.itemID] = {}));
					((!maxQuantityObj[obj.itemID].counter) && (maxQuantityObj[obj.itemID].counter = 0));

					var storageItemDetailsAr = [];
					angular.copy($scope.filterData($scope.reqQuotationRESTData.storageItemDetailsAr, "itemID", obj.itemID), storageItemDetailsAr);
					maxQuantityObj[obj.itemID].val = (storageItemDetailsAr.length - maxQuantityObj[obj.itemID].counter);

					var storageItemsAr = [];
					angular.copy($scope.reqQuotationRESTData.storageItemsAr, storageItemsAr);

					var filteredItemObj = $scope.filterData(storageItemsAr, "id", obj.itemID)[0];
					obj.item = filteredItemObj.name;
					filteredItemObj.isItemQuantity = (maxQuantityObj[obj.itemID].val > 0);
					if(!(maxQuantityObj[obj.itemID].val > 0)) {
						obj.itemQuantity = 0;
						obj.itemDiscount = 0;
						obj.serviceCharge = 0;
					}

					obj.storageItemsAr = [];
					angular.copy(storageItemsAr, obj.storageItemsAr);

					obj.itemMaxQuantity = maxQuantityObj[obj.itemID].val;

					obj.itemQuantityDetails = [];
					angular.forEach(storageItemDetailsAr, function(subObj, ind) {
						var counter = maxQuantityObj[subObj.itemID].counter;
						if((counter <= ind) && (ind < (counter + obj.itemQuantity))) {
							obj.itemQuantityDetails.push(subObj.itemQuantityID);
						}
					});

					maxQuantityObj[obj.itemID].counter += ((obj.itemQuantity && parseInt(obj.itemQuantity)) || 0);
				} else {
					var storageItemsAr = [];
					angular.copy($scope.reqQuotationRESTData.storageItemsAr, storageItemsAr);

					angular.forEach(storageItemsAr, function(subObj) {
						var itemMaxQuantity = $scope.filterData($scope.reqQuotationRESTData.storageItemDetailsAr, "itemID", subObj.id).length;

						var counter = 0;
						angular.forEach($scope.filterData($scope.reqQuotationSbmtData.jobsAr, "itemID", subObj.id), function(superSubObj) {
							counter += ((superSubObj.itemQuantity && parseInt(superSubObj.itemQuantity)) || 0);
						});

						subObj.isItemQuantity = (counter < itemMaxQuantity);
					});

					obj.storageItemsAr = [];
					angular.copy(storageItemsAr, obj.storageItemsAr);
				}
			});
		};

		$scope.getItemPrice = function(job) {
			var sum = 0;
			if(job.itemID) {
				job.itemQuantityDetails.forEach(function(itemQuantityID) {
					var price = $scope.filterData($scope.reqQuotationRESTData.storageItemDetailsAr, "itemQuantityID", itemQuantityID)[0].price;
					sum += price;
				});

				sum /= job.itemQuantity;
			}

			sum = $filter("toDecimal", 2)(sum);
			job.itemPrice = ((!isNaN(sum) && sum) || 0);
			return job.itemPrice;
		};

		$scope.getItemPriceDetails = function(job) {
			var tplAr = [];
			// var tpl = '';
			// tpl += '<ul>';
			if(job.itemID) {
				job.itemQuantityDetails.forEach(function(itemQuantityID, ind) {
					var itemQuantityIDObj = $scope.filterData($scope.reqQuotationRESTData.storageItemDetailsAr, "itemQuantityID", itemQuantityID)[0];
					// tpl += '<li>';
						// tpl += ('Unit ' + (ind + 1) + ': ' + itemQuantityIDObj.price);
					// tpl += '</li>';

					tplAr.push("Unit " + (ind + 1) + ": " + itemQuantityIDObj.price);
				});
			}
			// tpl += '</ul>';

			return tplAr.join("; ");
		};

		$scope.getItemTotal = function(job) {
			var itemTotal = (parseFloat(job.itemPrice) * job.itemQuantity);
			job.itemTotal = (itemTotal - (itemTotal * (job.itemDiscount * 0.01)));

			job.itemTotal = $filter("toDecimal", 2)(job.itemTotal);
			job.itemTotal = ((!isNaN(job.itemTotal) && job.itemTotal) || 0);
			return job.itemTotal;
		};

		$scope.getTotal = function(job) {
			job.total = (parseFloat(job.itemTotal) + job.serviceCharge);
			job.total += (job.total * (job.vat * 0.01));

			job.total = $filter("toDecimal", 2)(job.total);
			job.total = ((!isNaN(job.total) && job.total) || 0);
			return job.total;
		};

		$scope.getGrandTotal = function() {
			var grandTotal = 0;
			if($scope.reqQuotationSbmtData.jobsAr.length) {
				angular.forEach($scope.reqQuotationSbmtData.jobsAr, function(obj) {
					grandTotal += parseFloat(obj.total);
				});
			}

			grandTotal = $filter("toDecimal", 2)(grandTotal);
			return ((!isNaN(grandTotal) && grandTotal) || 0);
		};

		$scope.printReportTitle = function() {
			var printReportTitle = '';
			printReportTitle += ('<strong>Dated: ' + $filter("date")((new Date()), "dd-MM-yyyy") + '</strong>');

			return $sce.trustAsHtml(printReportTitle);
		}

		$scope.printReport = function() {
			var tpl = document.getElementById("home_servicereq_quotation_container_print").innerHTML;
			var popUp = window.open("", "_blank", "fullscreen=yes, height=700, scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no");
			popUp.document.open();

			var pdfTpl = '';
			pdfTpl += '<html>';
				pdfTpl += '<head>';
					pdfTpl += '<title>eGarage_Quotation</title>';
					pdfTpl += '<link href="assets/css/lib/bootstrap.min.css" rel="stylesheet" />';
					pdfTpl += '<link rel="stylesheet" type="text/css" href="assets/css/custom/style.css" />';
				pdfTpl += '</head>';
				pdfTpl += '<body onload="window.print()">' + tpl + '</body>';
			pdfTpl += '</html>';

			popUp.document.write(pdfTpl);
			popUp.document.close();
		};
		// <<=
	}
})();