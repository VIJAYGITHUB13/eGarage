(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("userCreateCtrl", userCreateCtrl);
	userCreateCtrl.$inject = [
		"$scope",
		"$state",
		"$filter",
		"dpConfFactory",
		"userInfoService",
		"infoMessagesFactory",
		"restAPIFactory",
		"alertInfoService",
		"isArResFactory",
		"userDetailsService"
	];

	function userCreateCtrl($scope, $state, $filter, dpConfFactory, userInfoService, infoMessagesFactory, restAPIFactory, alertInfoService, isArResFactory, userDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.userCreateRESTData = {};
			$scope.userCreateFormData = {};
			$scope.userCreateSbmtData = {};

			$scope.userCreateRESTData.genderAr = [];
			$scope.userCreateRESTData.maritalStatusAr = [];
			$scope.userCreateRESTData.userCategoriesAr = [];
			$scope.userCreateRESTData.contriesAr = [];
			$scope.userCreateRESTData.statesAr = [];
			$scope.userCreateRESTData.districtsAr = [];

			$scope.userCreateFormData.isMorePageInfo = false;
			$scope.userCreateFormData.isMorePersonalDetails = false;
			$scope.userCreateFormData.areEmployeeDetails = false;

			dpConfFactory.format = "DD-MM-YYYY";
			$scope.datetimepickerOptions = JSON.stringify(dpConfFactory);

			$scope.infoObj = {};
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
			if(jsonData.statusText === "OK") {
				var jsonObj = jsonData.data[0];
				$scope.userCreateRESTData.genderAr = jsonObj.genderAr;
				$scope.userCreateRESTData.maritalStatusAr = jsonObj.maritalStatusAr;
			}
		});

		var url = $scope.basePath;
		url += "script.php?task=usercategories";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					var responseAr = [];
					angular.forEach(responseData.data, function(obj) {
						responseAr.push({
							userCategoryID: parseInt(obj.user_category_id),
							userSubcategoryID: parseInt(obj.user_subcategory_id),
							userCategory: obj.user_category,
							userSubcategory: obj.user_subcategory
						});
					});
					angular.copy(responseAr, $scope.userCreateRESTData.userCategoriesAr);
				}
			}
		});

		var url = $scope.basePath;
		url += "script.php?task=addressinputs";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					// Countries >>
					var responseAr = [];
					angular.forEach(responseData.data[0], function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.userCreateRESTData.contriesAr);
					// <<

					// States >>
					var responseAr = [];
					angular.forEach(responseData.data[1], function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							countryid: parseInt(obj.country_id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.userCreateRESTData.statesAr);
					// <<

					// Districts >>
					var responseAr = [];
					angular.forEach(responseData.data[2], function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							stateid: parseInt(obj.state_id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.userCreateRESTData.districtsAr);
					// <<
				}
			}
		});
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

		$scope.userCreateFormSubmit = function() {
			var msg = "Are you sure?";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Create",
						className: "btn-primary"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						userCreateFormSubmit();
					}
				}
			});
		};

		function userCreateFormSubmit() {
			$scope.infoObj = {};
			
			var url = $scope.basePath;
			url += "script.php?task=create";

			var userCreateSbmtData = {};
			angular.copy($scope.userCreateSbmtData, userCreateSbmtData);

			var inputObj = {};
			inputObj.userCategoryModel = (userCreateSbmtData.userCategoryModel || 0);
			inputObj.firstNameModel = (userCreateSbmtData.firstNameModel || "");
			inputObj.lastNameModel = (userCreateSbmtData.lastNameModel || "");
			inputObj.genderModel = (userCreateSbmtData.genderModel || 0);

			inputObj.dobModel = "";
			if(userCreateSbmtData.dobModel) {
				inputObj.dobModel = (userCreateSbmtData.dobModel.split("-").reverse().join("-"));
			}
			
			inputObj.placeOfBirthModel = (userCreateSbmtData.placeOfBirthModel || "");
			inputObj.maritalStatusModel = (userCreateSbmtData.maritalStatusModel || 0);
			inputObj.mobileNoModel = (userCreateSbmtData.mobileNoModel || 0);
			inputObj.altMobileNoModel = (userCreateSbmtData.altMobileNoModel || 0);
			inputObj.emailIDModel = (userCreateSbmtData.emailIDModel || "");
			inputObj.altEmailIDModel = (userCreateSbmtData.altEmailIDModel || "");

			inputObj.salaryModel = ((userCreateSbmtData.salaryModel && $filter("toDecimal", 2)(userCreateSbmtData.salaryModel)) || 0);
			inputObj.leaveBalanceModel = ((userCreateSbmtData.leaveBalanceModel && parseInt(userCreateSbmtData.leaveBalanceModel)) || 0);
			inputObj.extraHoursWorkedModel = ((userCreateSbmtData.extraHoursWorkedModel && parseInt(userCreateSbmtData.extraHoursWorkedModel)) || 0);

			inputObj.presentAddLine1Model = (userCreateSbmtData.presentAddLine1Model || "");
			inputObj.presentAddLine2Model = (userCreateSbmtData.presentAddLine2Model || "");
			inputObj.presentAddLandmarkModel = (userCreateSbmtData.presentAddLandmarkModel || "");
			inputObj.presentAddCountryModel = (userCreateSbmtData.presentAddCountryModel || 0);
			inputObj.presentAddStateModel = (userCreateSbmtData.presentAddStateModel || 0);
			inputObj.presentAddDistrictModel = (userCreateSbmtData.presentAddDistrictModel || 0);
			inputObj.presentAddPincodeModel = (userCreateSbmtData.presentAddPincodeModel || 0);

			inputObj.permanentAddLine1Model = (userCreateSbmtData.permanentAddLine1Model || "");
			inputObj.permanentAddLine2Model = (userCreateSbmtData.permanentAddLine2Model || "");
			inputObj.permanentAddLandmarkModel = (userCreateSbmtData.permanentAddLandmarkModel || "");
			inputObj.permanentAddCountryModel = (userCreateSbmtData.permanentAddCountryModel || 0);
			inputObj.permanentAddStateModel = (userCreateSbmtData.permanentAddStateModel || 0);
			inputObj.permanentAddDistrictModel = (userCreateSbmtData.permanentAddDistrictModel || 0);
			inputObj.permanentAddPincodeModel = (userCreateSbmtData.permanentAddPincodeModel || 0);

			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					var resObj = responseData.data;
					switch(resObj.status) {
						case "ALREADY_EXISTS":
							angular.copy(infoMessagesFactory.info, $scope.infoObj);
							$scope.infoObj.msg = "The user already exists.";
						break;

						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.infoObj);
							$scope.infoObj.msg = "Created the details successfully.";
							alertInfoService.setInfo($scope.infoObj);

							var inputObj = {
								userid: resObj.response
							};
							userDetailsService.setInfo(inputObj);
							$state.go("home.users.view.details");
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.infoObj);
							$scope.infoObj.msg = "Error while creating the user details.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.infoObj);
					$scope.infoObj.title += " (" + responseData.status + ")";
					$scope.infoObj.msg = responseData.statusText;
				}
			});
		};

		$scope.addressMapping = function() {
			var obj = {};
			obj.presentAddLine1Model = $scope.userCreateSbmtData.presentAddLine1Model;
			obj.presentAddLine2Model = $scope.userCreateSbmtData.presentAddLine2Model;
			obj.presentAddLandmarkModel = $scope.userCreateSbmtData.presentAddLandmarkModel;
			obj.presentAddCountryModel = $scope.userCreateSbmtData.presentAddCountryModel;
			obj.presentAddStateModel = $scope.userCreateSbmtData.presentAddStateModel;
			obj.presentAddDistrictModel = $scope.userCreateSbmtData.presentAddDistrictModel;
			obj.presentAddPincodeModel = $scope.userCreateSbmtData.presentAddPincodeModel;

			$scope.userCreateSbmtData.permanentAddLine1Model = obj.presentAddLine1Model;
			$scope.userCreateSbmtData.permanentAddLine2Model = obj.presentAddLine2Model;
			$scope.userCreateSbmtData.permanentAddLandmarkModel = obj.presentAddLandmarkModel;
			$scope.userCreateSbmtData.permanentAddCountryModel = obj.presentAddCountryModel;
			$scope.userCreateSbmtData.permanentAddStateModel = obj.presentAddStateModel;
			$scope.userCreateSbmtData.permanentAddDistrictModel = obj.presentAddDistrictModel;
			$scope.userCreateSbmtData.permanentAddPincodeModel = obj.presentAddPincodeModel;
		};
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		$scope.reset = function() {
			var msg = "Are you sure?";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Reset",
						className: "btn-warning"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						$state.go($state.current, {}, { reload: true });
					}
				}
			});
		};
		// <<=
	}
})();