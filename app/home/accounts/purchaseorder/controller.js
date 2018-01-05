(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("purchaseOrderCtrl", purchaseOrderCtrl);
	purchaseOrderCtrl.$inject = [
		"$scope",
		"$state",
		"$filter",
		"$uibModal",
		"userInfoService",
		"infoMessagesFactory",
		"dpConfFactory",
		"restAPIFactory",
		"isArResFactory"
	];

	function purchaseOrderCtrl($scope, $state, $filter, $uibModal, userInfoService, infoMessagesFactory, dpConfFactory, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.purchaseOrderRESTData = {};
			$scope.purchaseOrderFormData = {};
			$scope.purchaseOrderSbmtData = {};

			$scope.purchaseOrderRESTData.suppliersAr = [];
			$scope.purchaseOrderRESTData.storageItemCatsAr = [];
			$scope.purchaseOrderRESTData.storageItemsAr = [];
			$scope.purchaseOrderRESTData.paymentModesAr = [];

			$scope.purchaseOrderFormData.activetr = null;

			dpConfFactory.format = "DD-MM-YYYY";
			$scope.dateTimePickerConf = JSON.stringify(dpConfFactory);

			$scope.msgObj = {};

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
					angular.copy(responseAr, $scope.purchaseOrderRESTData.suppliersAr);
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
					angular.copy(responseAr, $scope.purchaseOrderRESTData.storageItemCatsAr);
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
					angular.copy(responseAr, $scope.purchaseOrderRESTData.storageItemsAr);
					// <<
				}
			}
		});

		var url = $scope.basePath;
		url += "script.php?task=paymentmodes";
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
					angular.copy(responseAr, $scope.purchaseOrderRESTData.paymentModesAr);
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
					$scope.theadAr = jsonData.data[0].purchaseOrderTHeadAr;

					var url = $scope.basePath;
					url += "script.php?task=view";
					var inputObj = {
						code: ($scope.purchaseOrderSbmtData.invoiceCodeModel || ""),
						supID: ($scope.purchaseOrderSbmtData.supIDModel || 0),
						catID: ($scope.purchaseOrderSbmtData.catIDModel || 0),
						itemID: ($scope.purchaseOrderSbmtData.itemIDModel || 0),
						fdate: ($scope.purchaseOrderSbmtData.fdateModel || ""),
						tdate: ($scope.purchaseOrderSbmtData.tdateModel || "")
					};

					if(!Object.keys(inputObj).filter(function(key){ return inputObj[key]; }).length) {
						$scope.infoObj.msg = "Please apply the filter.";
					} else {
						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							if(responseData.statusText === "OK") {
								if(isArResFactory(responseData)) {
									$scope.infoObj.msg = "";

									var responseAr = [];
									angular.forEach(responseData.data, function(obj) {
										responseAr.push({
											id: (obj.id && parseInt(obj.id)),
											code: obj.code,
											supplier: obj.supplier,
											purchasedTotal: obj.purchased_total,
											category: obj.category,
											item: obj.item,
											quantity: obj.quantity,
											orderedBy: obj.ordered_by,
											orderedDate: obj.ordered_date
										});
									});
									angular.copy(responseAr, $scope.tbodyAr);

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
		$scope.purchaseOrderSbmtData.invoiceCodeModel = "ORD";
		$scope.searchFormSubmit();

		$scope.purchaseOrder = function() {
			$scope.msgObj = {};

			var modalInstance = $uibModal.open({
				size: "lg", // Ex: lg, sm
				templateUrl: "purchaseOrder.tpl.html",
				controller: function($uibModalInstance, $scope, $state, $filter, userInfoService, infoMessagesFactory, dpConfFactory, restAPIFactory, injectData) {
					// Objects decleration =>>
					// =======================
					$scope.basePath = $state.current.data.basePath;

					function initObjs() {
						$scope.modalRESTData = {};
						$scope.modalFormData = {};
						$scope.modalSbmtData = {};

						$scope.modalFormData.isDecleration = false;
						$scope.modalSbmtData.paymentModeModel = 1;
					}
					initObjs();

					dpConfFactory.format = "DD-MM-YYYY";
					$scope.dateTimePickerConf = JSON.stringify(dpConfFactory);
					// <<=

					// Rest calls for the page =>>
					// ===========================
					angular.copy(injectData.purchaseOrderRESTData, $scope.modalRESTData);
					// <<=
					
					// Behaviours of the page =>>
					// ==========================
					// Automated methods >>
					$scope.filterData = injectData.filterData;
					// <<

					$scope.getItemPurchasingTotal = function() {
						var itemPurchasingPrice = $scope.modalSbmtData.itemPurchasingPriceModel;
						var itemQuantity = $scope.modalSbmtData.itemQuantityModel;
						var itemServiceTax = $scope.modalSbmtData.itemServiceTaxModel;

						var itemPurchasingTotal = (itemPurchasingPrice * itemQuantity);

						itemPurchasingTotal += (itemPurchasingTotal * (itemServiceTax * 0.01));

						$scope.modalSbmtData.itemTotalModel = $filter("toDecimal", 2)(itemPurchasingTotal);

						return $scope.modalSbmtData.itemTotalModel;
					};

					$scope.suggestItemOfferPrice = function() {
						var itemQuantity = $scope.modalSbmtData.itemQuantityModel;
						var itemPurchasingTotal = $scope.modalSbmtData.itemTotalModel;

						var itemOfferPrice = (itemPurchasingTotal / itemQuantity);

						return $filter("toDecimal", 2)(itemOfferPrice);
					};

					$scope.getDueAmount = function() {
						var paymentAmount = $scope.modalSbmtData.paymentAmountModel;
						var itemPurchasingTotal = $scope.modalSbmtData.itemTotalModel;

						var dueAmount = (itemPurchasingTotal - paymentAmount);
						return $filter("toDecimal", 2)(dueAmount);
					};

					$scope.modalSubmit = function() {
						var url = $scope.basePath;
						url += "script.php?task=purchase";
						var inputObj = {
							supID: $scope.modalSbmtData.supIDModel,
							itemID: $scope.modalSbmtData.itemIDModel,
							itemQuantity: $scope.modalSbmtData.itemQuantityModel,
							itemPurchasingPrice: $filter("toDecimal", 2)($scope.modalSbmtData.itemPurchasingPriceModel),
							itemServiceTax: $filter("toDecimal", 2)($scope.modalSbmtData.itemServiceTaxModel),
							itemTotal: $filter("toDecimal", 2)($scope.modalSbmtData.itemTotalModel),
							itemOfferPrice: $filter("toDecimal", 2)($scope.modalSbmtData.itemOfferPriceModel),
							paymentMode: $scope.modalSbmtData.paymentModeModel,
							paymentDate: $scope.modalSbmtData.paymentDateModel,
							chequeNo: ($scope.modalSbmtData.chequeNoModel || 0),
							paymentAmount: $filter("toDecimal", 2)($scope.modalSbmtData.paymentAmountModel)
						};

						var userInfo = userInfoService.getInfo();
						inputObj.myid = userInfo.uid;

						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							var msgObj = {};
							if(responseData.statusText === "OK") {
								switch(responseData.data) {
									case "SUCCESS":
										angular.copy(infoMessagesFactory.success, msgObj);
										msgObj.msg = "Order purchased successfully.";
									break;

									case "ERROR_DB":
										angular.copy(infoMessagesFactory.danger, msgObj);
										msgObj.msg = "Error while purchasing the order.";
									break;
								}
							} else {
								angular.copy(infoMessagesFactory.danger, msgObj);
								msgObj.title += " (" + responseData.status + ")";
								msgObj.msg = responseData.statusText;
							}

							$uibModalInstance.close(msgObj);
						});
					}

					$scope.modalClose = function() {
						$uibModalInstance.dismiss();
					}
					// <<=
				},
				resolve: {
					injectData: {
						filterData: $scope.filterData,
						purchaseOrderRESTData: $scope.purchaseOrderRESTData
					}
				}
			});

			modalInstance.result.then(function(msgObj) {
				angular.copy(msgObj, $scope.msgObj);
				$scope.searchFormSubmit();
			});
		};

		$scope.viewInvoiceDetails = function(obj) {
			$scope.msgObj = {};

			var modalInstance = $uibModal.open({
				size: "lg", // Ex: lg, sm
				templateUrl: "viewInvoice.tpl.html",
				controller: function($uibModalInstance, $scope, $state, $filter, restAPIFactory, injectData) {
					// Objects decleration =>>
					// =======================
					$scope.basePath = $state.current.data.basePath;

					function initObjs() {
						// $scope.modalRESTData = {};
						$scope.modalFormData = {};
						$scope.modalSbmtData = {};

						$scope.modalFormData.invoiceCode = injectData.inputObj.code;
					}
					initObjs();
					// <<=

					// Behaviours of the page =>>
					// ==========================
					function fetchInvoiceDetails() {
						var url = $scope.basePath;
						url += "script.php?task=details";
						var inputObj = {
							invoiceID: injectData.inputObj.id
						};

						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							$scope.modalSbmtData = {};

							var obj = responseData.data[0];
							var modalSbmtData = {
								id: obj.id,
								code: obj.code,
								orderedBy: obj.ordered_by,
								supplier: obj.supplier,
								category: obj.category,
								item: obj.item,
								quantity: obj.quantity,
								purchasedPrice: obj.purchased_price,
								serviceTax: obj.service_tax,
								totalPurchasedPrice: obj.total_purchased_price,
								suggestedPrice: $filter("toDecimal", 2)(obj.suggested_price),
								offeredPrice: obj.offered_price
							};

							angular.copy(modalSbmtData, $scope.modalSbmtData);
						});
					}
					fetchInvoiceDetails();

					$scope.modalClose = function() {
						$uibModalInstance.dismiss();
					}
					// <<=
				},
				resolve: {
					injectData: {
						inputObj: obj
					}
				}
			});
		};

		$scope.payments = function(obj) {
			$scope.msgObj = {};

			var modalInstance = $uibModal.open({
				size: "lg", // Ex: lg, sm
				templateUrl: "payments.tpl.html",
				controller: function($uibModalInstance, $scope, $state, $filter, userInfoService, infoMessagesFactory, dpConfFactory, restAPIFactory, isArResFactory, injectData) {
					// Objects decleration =>>
					// =======================
					$scope.basePath = $state.current.data.basePath;

					function initObjs() {
						$scope.modalRESTData = {};
						$scope.modalFormData = {};
						$scope.modalSbmtData = {};

						$scope.modalSbmtData.paymentsAr = [];
						addRow();

						$scope.modalSbmtData.invoiceCodeModel = injectData.inputObj.code;

						$scope.tbodyAr = [];
					}
					initObjs();

					dpConfFactory.format = "DD-MM-YYYY";
					dpConfFactory.minDate = $filter("date")(injectData.inputObj.orderedDate, "MM-dd-yyyy");
					$scope.dateTimePickerConf = JSON.stringify(dpConfFactory);
					// <<=

					// Rest calls for the page =>>
					// ===========================
					angular.copy(injectData.purchaseOrderRESTData, $scope.modalRESTData);

					$scope.modalRESTData.purchasedTotal = parseFloat(injectData.inputObj.purchasedTotal);
					$scope.modalRESTData.orderedBy = injectData.inputObj.orderedBy;
					$scope.modalRESTData.orderedDate = $filter("date")(injectData.inputObj.orderedDate, "dd-MM-yyyy");

					function paymentHistory() {
						var url = $scope.basePath;
						url += "script.php?task=paymenthistory";
						var inputObj = {
							invoiceID: injectData.inputObj.id
						};

						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							if(responseData.statusText === "OK") {
								if(isArResFactory(responseData)) {
									var responseAr = [];
									var totalPaidAmount = 0;
									angular.forEach(responseData.data, function(obj) {
										var invoiceObj = {
											paymentMode: obj.payment_mode,
											paidDate: obj.paid_date,
											paidAmount: ((obj.paid_amount && parseFloat(obj.paid_amount)) || 0),
											paidBy: obj.paid_by
										};
										responseAr.push(invoiceObj);

										totalPaidAmount += invoiceObj.paidAmount;
									});
									angular.copy(responseAr, $scope.tbodyAr);

									$scope.modalRESTData.totalPaidAmount = $filter("toDecimal", 2)(totalPaidAmount);
									$scope.modalRESTData.dueAmount = ($scope.modalRESTData.purchasedTotal - totalPaidAmount);
								}
							}
						});
					}
					paymentHistory();
					// <<=
					
					// Behaviours of the page =>>
					// ==========================
					// Automated methods >>
					$scope.filterData = injectData.filterData;
					// <<

					function addRow() {
						var obj = {
							id: ($scope.modalSbmtData.paymentsAr.length + 1),
							paymentMode: 1,
							chequeNo: 0,
							paymentDate: "",
							paymentAmount: 0
						};

						$scope.modalSbmtData.paymentsAr.push(obj);
					}
					$scope.addRow = addRow;

					function sortPaymentsAr() {
						var paymentsAr = [];
						angular.copy($scope.modalSbmtData.paymentsAr, paymentsAr);

						paymentsAr.sort(function(a, b) {
							var aDateInMS = (new Date($filter("dmyToMDY")(a.paymentDate))).getTime();
							var bDateInMS = (new Date($filter("dmyToMDY")(b.paymentDate))).getTime();
							return (aDateInMS - bDateInMS);
						});

						return paymentsAr;
					}

					$scope.getDueAmount = function() {
						var totalPaymentAmount = $scope.modalSbmtData.paymentsAr.reduce(function(acc, obj) {
						return (acc + (obj.paymentAmount || 0));
						}, 0);

						return $filter("toDecimal", 2)($scope.modalRESTData.dueAmount - totalPaymentAmount);
					};

					$scope.modalSubmit = function() {
						var paymentsAr = sortPaymentsAr();

						var url = $scope.basePath;
						url += "script.php?task=makepayment";
						var inputObj = {
							invoiceID: injectData.inputObj.id,
							paymentsAr: paymentsAr
						};

						var userInfo = userInfoService.getInfo();
						inputObj.myid = userInfo.uid;

						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							var msgObj = {};
							if(responseData.statusText === "OK") {
								switch(responseData.data) {
									case "SUCCESS":
										angular.copy(infoMessagesFactory.success, msgObj);
										msgObj.msg = "Payment(s) made successfully.";
									break;

									case "ERROR_DB":
										angular.copy(infoMessagesFactory.danger, msgObj);
										msgObj.msg = "Error while making the payment(s).";
									break;
								}
							} else {
								angular.copy(infoMessagesFactory.danger, msgObj);
								msgObj.title += " (" + responseData.status + ")";
								msgObj.msg = responseData.statusText;
							}

							$uibModalInstance.close(msgObj);
						});
					}

					$scope.modalClose = function() {
						$uibModalInstance.dismiss();
					}
					// <<=
				},
				resolve: {
					injectData: {
						inputObj: obj,
						filterData: $scope.filterData,
						purchaseOrderRESTData: $scope.purchaseOrderRESTData
					}
				}
			});

			modalInstance.result.then(function(msgObj) {
				angular.copy(msgObj, $scope.msgObj);
				$scope.searchFormSubmit();
			});
		};

		$scope.printOrder = function(orderObj) {
			$scope.purchaseOrderSbmtData.printData = {};
			angular.copy(orderObj, $scope.purchaseOrderSbmtData.printData);
			$scope.purchaseOrderSbmtData.printData.dated = $filter("date")((new Date()), "dd-MM-yyyy");
			$scope.purchaseOrderSbmtData.printData.orderedDate = $filter("date")(orderObj.orderedDate, "dd-MM-yyyy");

			function paymentHistory() {
				var url = $scope.basePath;
				url += "script.php?task=paymenthistory";
				var inputObj = {
					invoiceID: orderObj.id
				};

				restAPIFactory("POST", url, inputObj).post(function(responseData) {
					if(responseData.statusText === "OK") {
						if(isArResFactory(responseData)) {
							var responseAr = [];
							var totalPaidAmount = 0;
							angular.forEach(responseData.data, function(obj) {
								var invoiceObj = {
									paymentMode: obj.payment_mode,
									paidDate: obj.paid_date,
									paidAmount: ((obj.paid_amount && parseFloat(obj.paid_amount)) || 0),
									paidBy: obj.paid_by
								};
								responseAr.push(invoiceObj);

								totalPaidAmount += invoiceObj.paidAmount;
							});
							$scope.purchaseOrderSbmtData.printData.tbodyAr = [];
							angular.copy(responseAr, $scope.purchaseOrderSbmtData.printData.tbodyAr);

							$scope.purchaseOrderSbmtData.printData.totalPaidAmount = $filter("toDecimal", 2)(totalPaidAmount);
							$scope.purchaseOrderSbmtData.printData.dueAmount = $filter("toDecimal", 2)($scope.purchaseOrderSbmtData.printData.purchasedTotal - totalPaidAmount);

							setTimeout(printOrder, 100);
							function printOrder() {
								var tpl = document.getElementById("home_accounts_purchaseorder_container_print").innerHTML;;
								var popUp = window.open("", "_blank", "fullscreen=yes, height=700, scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no");
								popUp.document.open();

								var pdfTpl = '';
								pdfTpl += '<html>';
									pdfTpl += '<head>';
										pdfTpl += '<title>eGarage_Order_Invoice_' + orderObj.code + '</title>';
										pdfTpl += '<link href="assets/css/lib/bootstrap.min.css" rel="stylesheet" />';
										pdfTpl += '<link rel="stylesheet" type="text/css" href="assets/css/custom/style.css" />';
									pdfTpl += '</head>';
									pdfTpl += '<body onload="window.print()">' + tpl + '</body>';
								pdfTpl += '</html>';

								popUp.document.write(pdfTpl);
								popUp.document.close();
							}
						}
					}
				});
			}
			paymentHistory();
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