(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("userUpdateDetailsCtrl", userUpdateDetailsCtrl);
	userUpdateDetailsCtrl.$inject = [
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

	function userUpdateDetailsCtrl($scope, $state, $filter, dpConfFactory, userInfoService, infoMessagesFactory, restAPIFactory, alertInfoService, isArResFactory, userDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.userUpdateRESTData = {};
			$scope.userUpdateFormData = {};
			$scope.userUpdateSbmtData = {};

			$scope.userUpdateRESTData.genderAr = [];
			$scope.userUpdateRESTData.maritalStatusAr = [];
			$scope.userUpdateRESTData.userCategoriesAr = [];
			$scope.userUpdateRESTData.contriesAr = [];
			$scope.userUpdateRESTData.statesAr = [];
			$scope.userUpdateRESTData.districtsAr = [];

			$scope.userUpdateFormData.isMorePersonalDetails = false;
			$scope.userUpdateFormData.areEmployeeDetails = false;

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
				$scope.userUpdateRESTData.genderAr = jsonObj.genderAr;
				$scope.userUpdateRESTData.maritalStatusAr = jsonObj.maritalStatusAr;
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
					angular.copy(responseAr, $scope.userUpdateRESTData.userCategoriesAr);
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
					angular.copy(responseAr, $scope.userUpdateRESTData.contriesAr);
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
					angular.copy(responseAr, $scope.userUpdateRESTData.statesAr);
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
					angular.copy(responseAr, $scope.userUpdateRESTData.districtsAr);
					// <<

					fetchUserProfile();
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

		function fetchUserProfile() {
			var userDetails = userDetailsService.getInfo();
			userDetailsService.clearInfo();

			var url = $scope.basePath;
			url += "script.php?task=userprofile";
			var inputObj = {
				userid: userDetails.userid
			};

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					$scope.userUpdateSbmtData = {};
					$scope.userUpdateFormData.isMorePersonalDetails = false;

					var obj = responseData.data[0];
					var userUpdateSbmtData = {
						userIDModel: (obj.id && parseInt(obj.id)),
						userCategoryModel: (obj.user_subcat_id && parseInt(obj.user_subcat_id)),
						firstNameModel: obj.first_name,
						lastNameModel: obj.last_name,
						genderModel: (obj.gender && parseInt(obj.gender)),
						dobModel: ($filter("date")(obj.dob, "dd-MM-yyyy")),
						placeOfBirthModel: obj.place_of_birth,
						maritalStatusModel: (obj.marital_status && parseInt(obj.marital_status)),
						mobileNoModel: (obj.mobile_no && parseInt(obj.mobile_no)),
						altMobileNoModel: (obj.alt_mobile_no && parseInt(obj.alt_mobile_no)),
						emailIDModel: obj.email_id,
						altEmailIDModel: obj.alt_email_id,
						salaryModel: (obj.salary && $filter("toDecimal", 2)(obj.salary)),
						leaveBalanceModel: (obj.leave_balance && parseInt(obj.leave_balance)),
						extraHoursWorkedModel: (obj.extra_hours_worked && parseInt(obj.extra_hours_worked)),
						presentAddLine1Model: obj.present_add_line1,
						presentAddLine2Model: obj.present_add_line2,
						presentAddLandmarkModel: obj.present_add_landmark,
						presentAddCountryModel: (obj.present_add_country_id && parseInt(obj.present_add_country_id)),
						presentAddStateModel: (obj.present_add_state_id && parseInt(obj.present_add_state_id)),
						presentAddDistrictModel: (obj.present_add_district_id && parseInt(obj.present_add_district_id)),
						presentAddPincodeModel: (obj.present_add_pincode && parseInt(obj.present_add_pincode)),
						permanentAddLine1Model: obj.permanent_add_line1,
						permanentAddLine2Model: obj.permanent_add_line2,
						permanentAddLandmarkModel: obj.permanent_add_landmark,
						permanentAddCountryModel: (obj.permanent_add_country_id && parseInt(obj.permanent_add_country_id)),
						permanentAddStateModel: (obj.permanent_add_state_id && parseInt(obj.permanent_add_state_id)),
						permanentAddDistrictModel: (obj.permanent_add_district_id && parseInt(obj.permanent_add_district_id)),
						permanentAddPincodeModel: (obj.permanent_add_pincode && parseInt(obj.permanent_add_pincode))
					};

					angular.copy(userUpdateSbmtData, $scope.userUpdateSbmtData);
				}
			});
		};

		$scope.userUpdateFormSubmit = function() {
			var msg = "Are you sure?";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Update",
						className: "btn-primary"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						userUpdateFormSubmit();
					}
				}
			});
		};

		function userUpdateFormSubmit() {
			$scope.infoObj = {};

			var url = $scope.basePath;
			url += "script.php?task=update";

			var userUpdateSbmtData = {};
			angular.copy($scope.userUpdateSbmtData, userUpdateSbmtData);

			var inputObj = {};
			inputObj.userIDModel = (userUpdateSbmtData.userIDModel || 0);
			inputObj.userCategoryModel = (userUpdateSbmtData.userCategoryModel || 0);
			inputObj.firstNameModel = (userUpdateSbmtData.firstNameModel || "");
			inputObj.lastNameModel = (userUpdateSbmtData.lastNameModel || "");
			inputObj.genderModel = (userUpdateSbmtData.genderModel || 0);

			inputObj.dobModel = "";
			if(userUpdateSbmtData.dobModel) {
				inputObj.dobModel = (userUpdateSbmtData.dobModel.split("-").reverse().join("-"));
			}
			
			inputObj.placeOfBirthModel = (userUpdateSbmtData.placeOfBirthModel || "");
			inputObj.maritalStatusModel = (userUpdateSbmtData.maritalStatusModel || 0);
			inputObj.mobileNoModel = (userUpdateSbmtData.mobileNoModel || 0);
			inputObj.altMobileNoModel = (userUpdateSbmtData.altMobileNoModel || 0);
			inputObj.emailIDModel = (userUpdateSbmtData.emailIDModel || "");
			inputObj.altEmailIDModel = (userUpdateSbmtData.altEmailIDModel || "");

			inputObj.salaryModel = ((userUpdateSbmtData.salaryModel && $filter("toDecimal", 2)(userUpdateSbmtData.salaryModel)) || 0);
			inputObj.leaveBalanceModel = ((userUpdateSbmtData.leaveBalanceModel && parseInt(userUpdateSbmtData.leaveBalanceModel)) || 0);
			inputObj.extraHoursWorkedModel = ((userUpdateSbmtData.extraHoursWorkedModel && parseInt(userUpdateSbmtData.extraHoursWorkedModel)) || 0);

			inputObj.presentAddLine1Model = (userUpdateSbmtData.presentAddLine1Model || "");
			inputObj.presentAddLine2Model = (userUpdateSbmtData.presentAddLine2Model || "");
			inputObj.presentAddLandmarkModel = (userUpdateSbmtData.presentAddLandmarkModel || "");
			inputObj.presentAddCountryModel = (userUpdateSbmtData.presentAddCountryModel || 0);
			inputObj.presentAddStateModel = (userUpdateSbmtData.presentAddStateModel || 0);
			inputObj.presentAddDistrictModel = (userUpdateSbmtData.presentAddDistrictModel || 0);
			inputObj.presentAddPincodeModel = (userUpdateSbmtData.presentAddPincodeModel || 0);

			inputObj.permanentAddLine1Model = (userUpdateSbmtData.permanentAddLine1Model || "");
			inputObj.permanentAddLine2Model = (userUpdateSbmtData.permanentAddLine2Model || "");
			inputObj.permanentAddLandmarkModel = (userUpdateSbmtData.permanentAddLandmarkModel || "");
			inputObj.permanentAddCountryModel = (userUpdateSbmtData.permanentAddCountryModel || 0);
			inputObj.permanentAddStateModel = (userUpdateSbmtData.permanentAddStateModel || 0);
			inputObj.permanentAddDistrictModel = (userUpdateSbmtData.permanentAddDistrictModel || 0);
			inputObj.permanentAddPincodeModel = (userUpdateSbmtData.permanentAddPincodeModel || 0);

			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					var resObj = responseData.data;
					switch(resObj.status) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.infoObj);
							$scope.infoObj.msg = "Updated the details successfully.";
							
							var inputObj = {
								userid: resObj.response
							};
							userDetailsService.setInfo(inputObj);
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.infoObj);
							$scope.infoObj.msg = "Error while updating the details.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.infoObj);
					$scope.infoObj.title += (" (" + responseData.status + ")");
					$scope.infoObj.msg = responseData.statusText;
				}

				alertInfoService.setInfo($scope.infoObj);
				$state.go("home.users.view.details");
			});
		};

		$scope.addressMapping = function() {
			var obj = {};
			obj.presentAddLine1Model = $scope.userUpdateSbmtData.presentAddLine1Model;
			obj.presentAddLine2Model = $scope.userUpdateSbmtData.presentAddLine2Model;
			obj.presentAddLandmarkModel = $scope.userUpdateSbmtData.presentAddLandmarkModel;
			obj.presentAddCountryModel = $scope.userUpdateSbmtData.presentAddCountryModel;
			obj.presentAddStateModel = $scope.userUpdateSbmtData.presentAddStateModel;
			obj.presentAddDistrictModel = $scope.userUpdateSbmtData.presentAddDistrictModel;
			obj.presentAddPincodeModel = $scope.userUpdateSbmtData.presentAddPincodeModel;

			$scope.userUpdateSbmtData.permanentAddLine1Model = obj.presentAddLine1Model;
			$scope.userUpdateSbmtData.permanentAddLine2Model = obj.presentAddLine2Model;
			$scope.userUpdateSbmtData.permanentAddLandmarkModel = obj.presentAddLandmarkModel;
			$scope.userUpdateSbmtData.permanentAddCountryModel = obj.presentAddCountryModel;
			$scope.userUpdateSbmtData.permanentAddStateModel = obj.presentAddStateModel;
			$scope.userUpdateSbmtData.permanentAddDistrictModel = obj.presentAddDistrictModel;
			$scope.userUpdateSbmtData.permanentAddPincodeModel = obj.presentAddPincodeModel;
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
						var inputObj = {
							userid: $scope.userUpdateSbmtData.userIDModel
						};
						userDetailsService.setInfo(inputObj);

						fetchUserProfile();
					}
				}
			});
		};
		// <<=
	}
})();