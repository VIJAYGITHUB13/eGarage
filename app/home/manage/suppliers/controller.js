(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("suppliersCtrl", suppliersCtrl);
	suppliersCtrl.$inject = [
		"$scope",
		"$state",
		"$uibModal",
		"userInfoService",
		"infoMessagesFactory",
		"dpConfFactory",
		"restAPIFactory",
		"isArResFactory"
	];

	function suppliersCtrl($scope, $state, $uibModal, userInfoService, infoMessagesFactory, dpConfFactory, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			// $scope.suppliersRESTData = {};
			$scope.suppliersFormData = {};
			$scope.suppliersSbmtData = {};

			$scope.suppliersFormData.activetr = null;

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
		// <<

		$scope.searchFormSubmit = function() {
			$scope.infoObj.msg = "Please wait...";
			$scope.tbodyAr = [];

			restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
				if(jsonData.statusText === "OK") {
					$scope.theadAr = jsonData.data[0].suppliersTHeadAr;

					var url = $scope.basePath;
					url += "script.php?task=view";
					var inputObj = {
						supCode: ($scope.suppliersSbmtData.supCodeModel || ""),
						supName: ($scope.suppliersSbmtData.supNameModel || ""),
						supContactNo: ($scope.suppliersSbmtData.supContactNoModel || ""),
						fdate: ($scope.suppliersSbmtData.fdateModel || ""),
						tdate: ($scope.suppliersSbmtData.tdateModel || "")
					};

					if(!Object.keys(inputObj).filter(function(key){ return ("" + inputObj[key]); }).length) {
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
											name: obj.name,
											invoiceCount: ((obj.invoice_count && parseInt(obj.invoice_count)) || 0),
											contactNo: obj.contact_no,
											emailID: obj.email_id,
											address: obj.address,
											createdOn: obj.created_on
										});
									});
									angular.copy(responseAr, $scope.tbodyAr);

									$scope.orderBy = "createdOn";
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
		$scope.suppliersSbmtData.supCodeModel = "SUP";
		$scope.searchFormSubmit();

		$scope.addSupplier = function() {
			$scope.msgObj = {};

			var modalInstance = $uibModal.open({
				size: "md", // Ex: lg, sm
				templateUrl: "suppliers.tpl.html",
				controller: function($uibModalInstance, $scope, $state, userInfoService, infoMessagesFactory, restAPIFactory) {
					$scope.basePath = $state.current.data.basePath;
					$scope.modalSbmtData = {};
					$scope.modalSbmtData.type = "add";

					$scope.modalSubmit = function() {
						var url = $scope.basePath;
						url += "script.php?task=add";
						var inputObj = {
							supName: $scope.modalSbmtData.supNameModel,
							supContactNo: $scope.modalSbmtData.supContactNoModel,
							supEmailID: $scope.modalSbmtData.supEmailIDModel,
							supAddress: $scope.modalSbmtData.supAddressModel
						};

						var userInfo = userInfoService.getInfo();
						inputObj.myid = userInfo.uid;

						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							var msgObj = {};
							if(responseData.statusText === "OK") {
								switch(responseData.data) {
									case "ALREADY_EXISTS":
										angular.copy(infoMessagesFactory.info, msgObj);
										msgObj.msg = "The supplier with the contact details already exists.";
									break;

									case "SUCCESS":
										angular.copy(infoMessagesFactory.success, msgObj);
										msgObj.msg = "Created the supplier successfully.";
									break;

									case "ERROR_DB":
										angular.copy(infoMessagesFactory.danger, msgObj);
										msgObj.msg = "Error while adding the supplier.";
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
				}
			});

			modalInstance.result.then(function(msgObj) {
				angular.copy(msgObj, $scope.msgObj);
				$scope.searchFormSubmit();
			});
		};

		$scope.updateSupplier = function(obj) {
			$scope.msgObj = {};

			var modalInstance = $uibModal.open({
				size: "md", // Ex: lg, sm
				templateUrl: "suppliers.tpl.html",
				controller: function($uibModalInstance, $scope, $state, userInfoService, infoMessagesFactory, restAPIFactory, injectData) {
					$scope.basePath = $state.current.data.basePath;
					$scope.modalSbmtData = {};
					$scope.modalSbmtData.type = "update";

					$scope.modalSbmtData.supIDModel = injectData.inputObj.id;
					$scope.modalSbmtData.supCodeModel = injectData.inputObj.code;
					$scope.modalSbmtData.supNameModel = injectData.inputObj.name;
					$scope.modalSbmtData.invoiceCountModel = injectData.inputObj.invoiceCount;
					$scope.modalSbmtData.supContactNoModel = injectData.inputObj.contactNo;
					$scope.modalSbmtData.supEmailIDModel = injectData.inputObj.emailID;
					$scope.modalSbmtData.supAddressModel = injectData.inputObj.address;

					$scope.modalSubmit = function() {
						var url = $scope.basePath;
						url += "script.php?task=update";
						var inputObj = {
							supID: $scope.modalSbmtData.supIDModel,
							supName: $scope.modalSbmtData.supNameModel,
							supContactNo: $scope.modalSbmtData.supContactNoModel,
							supEmailID: $scope.modalSbmtData.supEmailIDModel,
							supAddress: $scope.modalSbmtData.supAddressModel
						};

						var userInfo = userInfoService.getInfo();
						inputObj.myid = userInfo.uid;

						restAPIFactory("PUT", url, inputObj).post(function(responseData) {
							var msgObj = {};
							if(responseData.statusText === "OK") {
								switch(responseData.data) {
									case "SUCCESS":
										angular.copy(infoMessagesFactory.success, msgObj);
										msgObj.msg = "Updated the supplier successfully.";
									break;

									case "ERROR_DB":
										angular.copy(infoMessagesFactory.danger, msgObj);
										msgObj.msg = "Error while updating the supplier.";
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
				},
				resolve: {
					injectData: {
						inputObj: obj
					}
				}
			});

			modalInstance.result.then(function(msgObj) {
				angular.copy(msgObj, $scope.msgObj);
				$scope.searchFormSubmit();
			});
		};

		$scope.deleteSupplier = function(obj) {
			var msg = ("Are you sure to delete <strong>" + obj.code + "</strong>?");
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Delete Supplier",
						className: "btn-danger"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						deleteSupplier(obj);
					}
				}
			});
		};

		function deleteSupplier(obj) {
			$scope.msgObj = {};

			var url = $scope.basePath;
			url += "script.php?task=delete";
			var inputObj = {
				supID: obj.id
			};

			restAPIFactory("DELETE", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.msgObj);
							$scope.msgObj.msg = "Deleted the supplier successfully.";
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.msgObj);
							$scope.msgObj.msg = "Error while deleting the supplier.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.msgObj);
					$scope.msgObj.title += " (" + responseData.status + ")";
					$scope.msgObj.msg = responseData.statusText;
				}

				$scope.searchFormSubmit();
			});
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