(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("storageItemsCtrl", storageItemsCtrl);
	storageItemsCtrl.$inject = [
		"$scope",
		"$state",
		"$uibModal",
		"userInfoService",
		"infoMessagesFactory",
		"dpConfFactory",
		"restAPIFactory",
		"isArResFactory"
	];

	function storageItemsCtrl($scope, $state, $uibModal, userInfoService, infoMessagesFactory, dpConfFactory, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			// $scope.storageItemsRESTData = {};
			$scope.storageItemsFormData = {};
			$scope.storageItemsSbmtData = {};

			$scope.storageItemsFormData.activetr = null;

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
					$scope.theadAr = jsonData.data[0].storageItemCatsTHeadAr;

					var url = $scope.basePath;
					url += "script.php?task=view";
					var inputObj = {
						catCode: ($scope.storageItemsSbmtData.catCodeModel || ""),
						catName: ($scope.storageItemsSbmtData.catNameModel || ""),
						fdate: ($scope.storageItemsSbmtData.fdateModel || ""),
						tdate: ($scope.storageItemsSbmtData.tdateModel || "")
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
											itemCount: ((obj.item_count && parseInt(obj.item_count)) || 0),
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
		$scope.storageItemsSbmtData.catCodeModel = "UNITCAT";
		$scope.searchFormSubmit();

		$scope.addStorageItemCat = function() {
			$scope.msgObj = {};

			var modalInstance = $uibModal.open({
				size: "sm", // Ex: lg, sm
				templateUrl: "storageItemCat.tpl.html",
				controller: function($uibModalInstance, $scope, $state, userInfoService, infoMessagesFactory, restAPIFactory) {
					$scope.basePath = $state.current.data.basePath;
					$scope.modalSbmtData = {};
					$scope.modalSbmtData.type = "add";

					$scope.modalSubmit = function() {
						var url = $scope.basePath;
						url += "script.php?task=add";
						var inputObj = {
							catName: $scope.modalSbmtData.catNameModel
						};

						var userInfo = userInfoService.getInfo();
						inputObj.myid = userInfo.uid;

						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							var msgObj = {};
							if(responseData.statusText === "OK") {
								switch(responseData.data) {
									case "SUCCESS":
										angular.copy(infoMessagesFactory.success, msgObj);
										msgObj.msg = "Created the storage item category successfully.";
									break;

									case "ERROR_DB":
										angular.copy(infoMessagesFactory.danger, msgObj);
										msgObj.msg = "Error while adding the storage item category.";
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

		$scope.updateStorageItemCat = function(obj) {
			$scope.msgObj = {};

			var modalInstance = $uibModal.open({
				size: "sm", // Ex: lg, sm
				templateUrl: "storageItemCat.tpl.html",
				controller: function($uibModalInstance, $scope, $state, userInfoService, infoMessagesFactory, restAPIFactory, injectData) {
					$scope.basePath = $state.current.data.basePath;
					$scope.modalSbmtData = {};
					$scope.modalSbmtData.type = "update";

					$scope.modalSbmtData.catIDModel = injectData.inputObj.id;
					$scope.modalSbmtData.catCodeModel = injectData.inputObj.code;
					$scope.modalSbmtData.catNameModel = injectData.inputObj.name;

					$scope.modalSubmit = function() {
						var url = $scope.basePath;
						url += "script.php?task=update";
						var inputObj = {
							catID: $scope.modalSbmtData.catIDModel,
							catName: $scope.modalSbmtData.catNameModel
						};

						var userInfo = userInfoService.getInfo();
						inputObj.myid = userInfo.uid;

						restAPIFactory("PUT", url, inputObj).post(function(responseData) {
							var msgObj = {};
							if(responseData.statusText === "OK") {
								switch(responseData.data) {
									case "SUCCESS":
										angular.copy(infoMessagesFactory.success, msgObj);
										msgObj.msg = "Updated the storage item category successfully.";
									break;

									case "ERROR_DB":
										angular.copy(infoMessagesFactory.danger, msgObj);
										msgObj.msg = "Error while updating the storage item category.";
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

		$scope.deleteStorageItemCat = function(obj) {
			var msg = ("Are you sure to delete <strong>" + obj.code + "</strong>?");
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Delete Storage Item Category",
						className: "btn-danger"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						deleteStorageItemCat(obj);
					}
				}
			});
		};

		function deleteStorageItemCat(obj) {
			$scope.msgObj = {};

			var url = $scope.basePath;
			url += "script.php?task=delete";
			var inputObj = {
				catID: obj.id
			};

			restAPIFactory("DELETE", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.msgObj);
							$scope.msgObj.msg = "Deleted the storage item category successfully.";
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.msgObj);
							$scope.msgObj.msg = "Error while deleting the storage item category.";
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

		$scope.viewStorageItems = function(obj) {
			$scope.msgObj = {};

			var modalInstance = $uibModal.open({
				size: "lg", // Ex: lg, sm
				templateUrl: "storageItems.tpl.html",
				controller: function($uibModalInstance, $scope, $state, userInfoService, infoMessagesFactory, restAPIFactory, injectData) {
					$scope.basePath = $state.current.data.basePath;
					$scope.modalSbmtData = {};

					$scope.modalSbmtData.catCodeModel = injectData.inputObj.code;
					$scope.modalSbmtData.catNameModel = injectData.inputObj.name;
					$scope.modalSbmtData.activetr = null;

					$scope.msgObj = {};
					$scope.infoObj = {};
					$scope.infoObj.msg = "Please wait...";
					function fetchStorageItems() {
						$scope.infoObj.msg = "Please wait...";
						$scope.tbodyAr = [];

						restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
							if(jsonData.statusText === "OK") {
								$scope.theadAr = jsonData.data[0].modalStorageItemsTHeadAr;

								var url = $scope.basePath;
								url += "script.php?task=storageitems";
								var inputObj = {
									catID: parseInt(injectData.inputObj.id)
								};

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
													itemInstalledCount: ((obj.item_installed_count && parseInt(obj.item_installed_count)) || 0),
													createdOn: obj.created_on,
													isEdit: false
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
							} else {
								$scope.infoObj.msg = "Something went wrong.";
							}
						});
					};
					fetchStorageItems();

					$scope.addStorageItem = function() {
						$scope.msgObj = {};

						var url = $scope.basePath;
						url += "script.php?task=addstorageitem";
						var inputObj = {
							category: injectData.inputObj.id,
							unitName: $scope.modalSbmtData.unitNameModel
						};

						var userInfo = userInfoService.getInfo();
						inputObj.myid = userInfo.uid;

						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							if(responseData.statusText === "OK") {
								switch(responseData.data) {
									case "SUCCESS":
										angular.copy(infoMessagesFactory.success, $scope.msgObj);
										$scope.msgObj.msg = "Created the storage item successfully.";
									break;

									case "ERROR_DB":
										angular.copy(infoMessagesFactory.danger, $scope.msgObj);
										$scope.msgObj.msg = "Error while adding the storage item.";
									break;
								}
							} else {
								angular.copy(infoMessagesFactory.danger, $scope.msgObj);
								$scope.msgObj.title += " (" + responseData.status + ")";
								$scope.msgObj.msg = responseData.statusText;
							}

							fetchStorageItems();
						});
					};

					$scope.updateStorageItem = function(obj) {
						$scope.msgObj = {};

						var url = $scope.basePath;
						url += "script.php?task=updatestorageitem";
						var inputObj = {
							unitID: obj.id,
							unitName: obj.name
						};

						var userInfo = userInfoService.getInfo();
						inputObj.myid = userInfo.uid;

						restAPIFactory("PUT", url, inputObj).post(function(responseData) {
							if(responseData.statusText === "OK") {
								switch(responseData.data) {
									case "SUCCESS":
										angular.copy(infoMessagesFactory.success, $scope.msgObj);
										$scope.msgObj.msg = "Updated the storage item successfully.";
									break;

									case "ERROR_DB":
										angular.copy(infoMessagesFactory.danger, $scope.msgObj);
										$scope.msgObj.msg = "Error while updating the storage item.";
									break;
								}
							} else {
								angular.copy(infoMessagesFactory.danger, $scope.msgObj);
								$scope.msgObj.title += " (" + responseData.status + ")";
								$scope.msgObj.msg = responseData.statusText;
							}

							fetchStorageItems();
						});
					};

					$scope.deleteStorageItem = function(obj) {
						$scope.msgObj = {};

						var url = $scope.basePath;
						url += "script.php?task=deletestorageitem";
						var inputObj = {
							unitID: obj.id
						};

						restAPIFactory("DELETE", url, inputObj).post(function(responseData) {
							if(responseData.statusText === "OK") {
								switch(responseData.data) {
									case "SUCCESS":
										angular.copy(infoMessagesFactory.success, $scope.msgObj);
										$scope.msgObj.msg = "Deleted the storage item successfully.";
									break;

									case "ERROR_DB":
										angular.copy(infoMessagesFactory.danger, $scope.msgObj);
										$scope.msgObj.msg = "Error while deleting the storage item.";
									break;
								}
							} else {
								angular.copy(infoMessagesFactory.danger, $scope.msgObj);
								$scope.msgObj.title += " (" + responseData.status + ")";
								$scope.msgObj.msg = responseData.statusText;
							}

							fetchStorageItems();
						});
					};

					$scope.modalClose = function() {
						$uibModalInstance.close();
					};
				},
				resolve: {
					injectData: {
						inputObj: obj
					}
				}
			});

			modalInstance.result.then(function() {
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