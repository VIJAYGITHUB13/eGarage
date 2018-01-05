(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("userUploadConfirmCtrl", userUploadConfirmCtrl);
	userUploadConfirmCtrl.$inject = [
		"$scope",
		"$state",
		"dpConfFactory",
		"userInfoService",
		"infoMessagesFactory",
		"restAPIFactory",
		"userUploadService",
		"userUploadFileService"
	];

	function userUploadConfirmCtrl($scope, $state, dpConfFactory, userInfoService, infoMessagesFactory, restAPIFactory, userUploadService, userUploadFileService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			// $scope.userUploadConfirmRESTData = {};
			$scope.userUploadConfirmFormData = {};
			$scope.userUploadConfirmSbmtData = {};

			$scope.userUploadConfirmFormData.isMorePageInfo = false;

			var userUpload = userUploadService.getInfo();
			userUploadService.clearInfo();
			$scope.userUploadConfirmFormData.ucategoryName = userUpload.name;
			$scope.userUploadConfirmFormData.ucategory = userUpload.id;

			$scope.infoObj = {};
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		// <<=
		
		// Behaviours of the page =>>
		// ==========================
		function uploadedFileData() {
			restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
				if(jsonData.statusText === "OK") {
					$scope.theadAr = jsonData.data[0].reguploadTHeadAr;
					var uploadedUDetailsAr = userUploadFileService.getInfo();

					$scope.infoObj = {};
					if(!uploadedUDetailsAr.length) {
						angular.copy(infoMessagesFactory.danger, $scope.infoObj);
						$scope.infoObj.type = "INVALID_TEMPLATE";
						$scope.infoObj.msg = "No records found in the template.";
					} else if($scope.theadAr.length !== uploadedUDetailsAr[0].length) {
						angular.copy(infoMessagesFactory.danger, $scope.infoObj);
						$scope.infoObj.type = "INVALID_TEMPLATE";
						$scope.infoObj.msg = "Please choose suitable template as it has missing column(s).";
					} else {
						var checkDup = function(checkAr) {
							return checkAr.some(function(val, key){ 
								return (checkAr.indexOf(val) !== key);
							});
						};

						var tbodyMNoDupAr = uploadedUDetailsAr.map(function(item) {
							return item[2];
						});
						var tbodyEIDDupAr = uploadedUDetailsAr.map(function(item) {
							return item[4];
						});

						if(checkDup(tbodyMNoDupAr) || checkDup(tbodyEIDDupAr)) {
							angular.copy(infoMessagesFactory.danger, $scope.infoObj);
							$scope.infoObj.type = "INVALID_TEMPLATE";
							$scope.infoObj.msg = "The template consists of similar Mobile No(s) or Email ID(s) for multiple user details. Please modify the same in the template and upload again.";
						} else {
							var tbodyAr = [];
							angular.forEach(uploadedUDetailsAr, function(rowVal, rowKey) {
								var obj = {};

								angular.forEach(rowVal, function(cellVal, cellKey) {
									obj[$scope.theadAr[cellKey].code] = cellVal;
								});

								tbodyAr.push(obj);
							});

							$scope.tbodyAr = [];
							angular.copy(tbodyAr, $scope.tbodyAr);

							$scope.orderBy = "fname";
							$scope.orderByDir = false;
							$scope.sortColumn = function(code) {
								$scope.orderBy = code;
								$scope.orderByDir = !$scope.orderByDir;
							};
						}
					}
				}
			});
		}
		uploadedFileData();

		$(document).on("click", "input[name=check]", function(e) {
			$("input[name=checkall]")[0].checked = ($("input[name=check]").length === $("input[name=check]:checked").length);
		});

		$scope.checkall = function() {
			angular.forEach($("input[name=check]"), function(obj, key) {
				obj.checked = $("input[name=checkall]")[0].checked;
			});
		};

		$scope.showConfirm = function() {
			return (!$scope.infoObj.type || ($scope.infoObj.type === "ALREADY_EXISTS") || ($scope.infoObj.type === "PARTIAL_SUCCESS"));
		};

		$scope.isConfirm = function() {
			return $("input[name=check]:checked").length;
		};

		$scope.userUploadConfirm = function() {
			var msg = "";
			msg += "Are you sure to create the users of type <strong>" + $scope.userUploadConfirmFormData.ucategoryName + "</strong>?";

			bootbox.confirm(msg, function(actionFlag) {
				if(actionFlag) {
					var tbodyAr = [];
					angular.forEach(userUploadFileService.getInfo(), function(rowVal, rowKey) {
						if($("input[name=check]")[rowKey].checked) {
							var obj = {};
							obj.ind = rowKey;

							angular.forEach(rowVal, function(cellVal, cellKey) {
								obj[$scope.theadAr[cellKey].code] = cellVal;
							});

							tbodyAr.push(obj);
						}
					});

					var userInfo = userInfoService.getInfo();
					var inputObj = {
						userdetails: tbodyAr,
						ucategory: $scope.userUploadConfirmFormData.ucategory,
						myid: parseInt(userInfo.uid)
					};

					$scope.infoObj = {};
					var url = $scope.basePath;
					url += "script.php?task=upload";
					restAPIFactory("POST", url, JSON.stringify(inputObj)).post(function(responseData) {
						if(responseData.statusText === "OK") {
							var uploadedUDetailsAr = userUploadFileService.getInfo();

							var render_udetails = function() {
								var tbodyAr = [];
								angular.forEach(userUploadFileService.getInfo(), function(rowVal, rowKey) {
									var checkRender = function() {
										var check1 = ((responseData.data.registered_ar.indexOf(rowKey) !== -1) && (responseData.data.type === "SUCCESS"));
										var check2 = ((responseData.data.registered_ar.indexOf(rowKey) === -1) && (responseData.data.type === "PARTIAL_SUCCESS"));

										return (check1 || check2);
									}

									if(checkRender()) {
										var obj = {};

										angular.forEach(rowVal, function(cellVal, cellKey) {
											obj[$scope.theadAr[cellKey].code] = cellVal;
										});

										tbodyAr.push(obj);
									}
								});

								$scope.tbodyAr = [];
								angular.copy(tbodyAr, $scope.tbodyAr);

								$scope.orderBy = "fname";
								$scope.orderByDir = false;
								$scope.sortColumn = function(code) {
									$scope.orderBy = code;
									$scope.orderByDir = !$scope.orderByDir;
								};
							};

							switch(responseData.data.type) {
								case "ALREADY_EXISTS":
									angular.forEach(uploadedUDetailsAr, function(rowVal, rowKey) {
										var rowObj = $("#useruploadconfirmtable > tbody").find("tr")[rowKey];

										if(responseData.data.exists_ar.indexOf(rowKey) != -1) {
											$("input[name=check]")[rowKey].checked = false;
											$(rowObj).css("font-weight", "bold");
											$(rowObj).addClass("text-warning");
										}
									});

									angular.copy(infoMessagesFactory.warning, $scope.infoObj);
								break;

								case "ERROR_DB":
									angular.copy(infoMessagesFactory.danger, $scope.infoObj);
								break;

								case "SUCCESS":
									render_udetails();
									angular.copy(infoMessagesFactory.success, $scope.infoObj);
								break;

								case "PARTIAL_SUCCESS":
									render_udetails();

									var updateUploadedUDetailsAr = [];
									angular.forEach(uploadedUDetailsAr, function(rowVal, rowKey) {
										if(responseData.data.registered_ar.indexOf(rowKey) === -1) {
											updateUploadedUDetailsAr.push(rowVal);
										}
									});

									userUploadFileService.clearInfo();
									userUploadFileService.getInfo(updateUploadedUDetailsAr);

									angular.copy(infoMessagesFactory.info, $scope.infoObj);
								break;

								default:
									angular.copy(infoMessagesFactory.info, $scope.infoObj);
								break;
							}

							$scope.infoObj.type = responseData.data.type;
							$scope.infoObj.msg = responseData.data.response;
						} else {
							angular.copy(infoMessagesFactory.danger, $scope.infoObj);
							$scope.infoObj.title += (" (" + responseData.status + ")");
							$scope.infoObj.msg = responseData.statusText;
						}
					});
				}
			});
		};
		// <<=
	}
})();