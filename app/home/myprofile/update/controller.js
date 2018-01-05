(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("myProfileUpdateCtrl", myProfileUpdateCtrl);
	myProfileUpdateCtrl.$inject = [
		"$scope",
		"$state",
		"$filter",
		"userInfoService",
		"dpConfFactory",
		"infoMessagesFactory",
		"restAPIFactory",
		"alertInfoService",
		"isArResFactory"
	];

	function myProfileUpdateCtrl($scope, $state, $filter, userInfoService, dpConfFactory, infoMessagesFactory, restAPIFactory, alertInfoService, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.myProfileUpdateRESTData = {};
			$scope.myProfileUpdateFormData = {};
			$scope.myProfileUpdateSbmtData = {};

			$scope.myProfileUpdateRESTData.genderAr = [];
			$scope.myProfileUpdateRESTData.maritalStatusAr = [];
			$scope.myProfileUpdateRESTData.userCategoriesAr = [];
			$scope.myProfileUpdateRESTData.contriesAr = [];
			$scope.myProfileUpdateRESTData.statesAr = [];
			$scope.myProfileUpdateRESTData.districtsAr = [];

			$scope.myProfileUpdateFormData.isMorePersonalDetails = false;
			$scope.myProfileUpdateFormData.areEmployeeDetails = false;

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
				$scope.myProfileUpdateRESTData.genderAr = jsonObj.genderAr;
				$scope.myProfileUpdateRESTData.maritalStatusAr = jsonObj.maritalStatusAr;
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
							id: parseInt(obj.id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.myProfileUpdateRESTData.userCategoriesAr);
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
					angular.copy(responseAr, $scope.myProfileUpdateRESTData.contriesAr);
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
					angular.copy(responseAr, $scope.myProfileUpdateRESTData.statesAr);
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
					angular.copy(responseAr, $scope.myProfileUpdateRESTData.districtsAr);
					// <<

					fetchMyProfile();
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

		function fetchMyProfile() {
			var myDetails = userInfoService.getInfo();

			var url = $scope.basePath;
			url += "script.php?task=myprofile";
			var inputObj = {
				myid: myDetails.uid
			};

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					$scope.myProfileUpdateSbmtData = {};
					$scope.myProfileUpdateFormData.isMorePersonalDetails = false;

					var obj = responseData.data[0];
					var myProfileUpdateSbmtData = {
						userCategoryID: (obj.user_cat_id && parseInt(obj.user_cat_id)),
						userCategoryModel: (obj.user_cat_id && parseInt(obj.user_cat_id)),
						userCategoryNameModel: obj.user_cat_name,
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
						salary: (obj.salary && $filter("toDecimal", 2)(obj.salary)),
						leaveBalance: (obj.leave_balance && parseInt(obj.leave_balance)),
						extraHoursWorked: (obj.extra_hours_worked && parseInt(obj.extra_hours_worked)),
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

					var myNameAr = [];
					var firstNameModel = myProfileUpdateSbmtData.firstNameModel;
					if(typeof firstNameModel === "string") {
						myNameAr.push(firstNameModel.trim());
					}
					var lastNameModel = myProfileUpdateSbmtData.lastNameModel;
					if(typeof lastNameModel === "string") {
						myNameAr.push(lastNameModel.trim());
					}
					myProfileUpdateSbmtData.fullNameModel = myNameAr.join(" ");

					angular.copy(myProfileUpdateSbmtData, $scope.myProfileUpdateSbmtData);
				}
			});
		};

		$scope.myProfileUpdateFormSubmit = function() {
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
						myProfileUpdateFormSubmit();
					}
				}
			});
		};

		function myProfileUpdateFormSubmit() {
			$scope.infoObj = {};

			var url = $scope.basePath;
			url += "script.php?task=update";

			var myProfileUpdateSbmtData = {};
			angular.copy($scope.myProfileUpdateSbmtData, myProfileUpdateSbmtData);

			var inputObj = {};
			inputObj.userCategoryModel = (myProfileUpdateSbmtData.userCategoryModel || 0);
			inputObj.firstNameModel = (myProfileUpdateSbmtData.firstNameModel || "");
			inputObj.lastNameModel = (myProfileUpdateSbmtData.lastNameModel || "");
			inputObj.genderModel = (myProfileUpdateSbmtData.genderModel || 0);

			inputObj.dobModel = "";
			if(myProfileUpdateSbmtData.dobModel) {
				inputObj.dobModel = (myProfileUpdateSbmtData.dobModel.split("-").reverse().join("-"));
			}
			
			inputObj.placeOfBirthModel = (myProfileUpdateSbmtData.placeOfBirthModel || "");
			inputObj.maritalStatusModel = (myProfileUpdateSbmtData.maritalStatusModel || 0);
			inputObj.mobileNoModel = (myProfileUpdateSbmtData.mobileNoModel || 0);
			inputObj.altMobileNoModel = (myProfileUpdateSbmtData.altMobileNoModel || 0);
			inputObj.emailIDModel = (myProfileUpdateSbmtData.emailIDModel || "");
			inputObj.altEmailIDModel = (myProfileUpdateSbmtData.altEmailIDModel || "");
			inputObj.presentAddLine1Model = (myProfileUpdateSbmtData.presentAddLine1Model || "");
			inputObj.presentAddLine2Model = (myProfileUpdateSbmtData.presentAddLine2Model || "");
			inputObj.presentAddLandmarkModel = (myProfileUpdateSbmtData.presentAddLandmarkModel || "");
			inputObj.presentAddCountryModel = (myProfileUpdateSbmtData.presentAddCountryModel || 0);
			inputObj.presentAddStateModel = (myProfileUpdateSbmtData.presentAddStateModel || 0);
			inputObj.presentAddDistrictModel = (myProfileUpdateSbmtData.presentAddDistrictModel || 0);
			inputObj.presentAddPincodeModel = (myProfileUpdateSbmtData.presentAddPincodeModel || 0);
			inputObj.permanentAddLine1Model = (myProfileUpdateSbmtData.permanentAddLine1Model || "");
			inputObj.permanentAddLine2Model = (myProfileUpdateSbmtData.permanentAddLine2Model || "");
			inputObj.permanentAddLandmarkModel = (myProfileUpdateSbmtData.permanentAddLandmarkModel || "");
			inputObj.permanentAddCountryModel = (myProfileUpdateSbmtData.permanentAddCountryModel || 0);
			inputObj.permanentAddStateModel = (myProfileUpdateSbmtData.permanentAddStateModel || 0);
			inputObj.permanentAddDistrictModel = (myProfileUpdateSbmtData.permanentAddDistrictModel || 0);
			inputObj.permanentAddPincodeModel = (myProfileUpdateSbmtData.permanentAddPincodeModel || 0);

			var myDetails = userInfoService.getInfo();
			inputObj.myid = myDetails.uid;

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.infoObj);
							$scope.infoObj.msg = "Updated the details successfully.";
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
				$state.go("home.myprofile");
			});
		};

		$scope.addressMapping = function() {
			var obj = {};
			obj.presentAddLine1Model = $scope.myProfileUpdateSbmtData.presentAddLine1Model;
			obj.presentAddLine2Model = $scope.myProfileUpdateSbmtData.presentAddLine2Model;
			obj.presentAddLandmarkModel = $scope.myProfileUpdateSbmtData.presentAddLandmarkModel;
			obj.presentAddCountryModel = $scope.myProfileUpdateSbmtData.presentAddCountryModel;
			obj.presentAddStateModel = $scope.myProfileUpdateSbmtData.presentAddStateModel;
			obj.presentAddDistrictModel = $scope.myProfileUpdateSbmtData.presentAddDistrictModel;
			obj.presentAddPincodeModel = $scope.myProfileUpdateSbmtData.presentAddPincodeModel;

			$scope.myProfileUpdateSbmtData.permanentAddLine1Model = obj.presentAddLine1Model;
			$scope.myProfileUpdateSbmtData.permanentAddLine2Model = obj.presentAddLine2Model;
			$scope.myProfileUpdateSbmtData.permanentAddLandmarkModel = obj.presentAddLandmarkModel;
			$scope.myProfileUpdateSbmtData.permanentAddCountryModel = obj.presentAddCountryModel;
			$scope.myProfileUpdateSbmtData.permanentAddStateModel = obj.presentAddStateModel;
			$scope.myProfileUpdateSbmtData.permanentAddDistrictModel = obj.presentAddDistrictModel;
			$scope.myProfileUpdateSbmtData.permanentAddPincodeModel = obj.presentAddPincodeModel;
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
						fetchMyProfile();
					}
				}
			});
		};
		// <<=
	}
})();