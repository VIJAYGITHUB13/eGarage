(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("userDetailsCtrl", userDetailsCtrl);
	userDetailsCtrl.$inject = [
		"$scope",
		"$state",
		"$filter",
		"alertInfoService",
		"restAPIFactory",
		"isArResFactory",
		"userDetailsService"
	];

	function userDetailsCtrl($scope, $state, $filter, alertInfoService, restAPIFactory, isArResFactory, userDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.userDetailsRESTData = {};
			$scope.userDetailsFormData = {};
			$scope.userDetailsSbmtData = {};

			$scope.userDetailsRESTData.genderAr = [];
			$scope.userDetailsRESTData.maritalStatusAr = [];
			$scope.userDetailsRESTData.contriesAr = [];
			$scope.userDetailsRESTData.statesAr = [];
			$scope.userDetailsRESTData.districtsAr = [];

			$scope.userDetailsFormData.isMorePersonalDetails = false;
			$scope.userDetailsFormData.areEmployeeDetails = false;

			$scope.infoObj = {};
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
			if(jsonData.statusText === "OK") {
				var jsonObj = jsonData.data[0];
				$scope.userDetailsRESTData.genderAr = jsonObj.genderAr;
				$scope.userDetailsRESTData.maritalStatusAr = jsonObj.maritalStatusAr;
			}
		});

		var url = $scope.basePath;
		url += "script.php?task=addressinputs";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					angular.copy(formatResAr(responseData.data[0]), $scope.userDetailsRESTData.contriesAr);
					angular.copy(formatResAr(responseData.data[1]), $scope.userDetailsRESTData.statesAr);
					angular.copy(formatResAr(responseData.data[2]), $scope.userDetailsRESTData.districtsAr);

					fetchUserProfile();
				}
			}
		});

		function formatResAr(inputAr) {
			var responseAr = [];
			angular.forEach(inputAr, function(obj) {
				responseAr.push({
					id: parseInt(obj.id),
					name: obj.name
				});
			});

			return responseAr;
		};
		// <<=

		// Behaviours of the page =>>
		// ==========================
		// Automated methods >>
		var filterData = function(inputAr, inputKey, inputVal) {
			return inputAr.filter(function(obj) {
				return (obj[inputKey] === inputVal);
			})[0];
		};
		// <<

		function fetchUserProfile() {
			$scope.infoObj = {};
			var alertInfo = alertInfoService.getInfo();
			if(alertInfo !== undefined) {
				if(Object.keys(alertInfo).length) {
					angular.copy(alertInfo, $scope.infoObj);
					alertInfoService.clearInfo();
				}
			}

			var userDetails = userDetailsService.getInfo();
			userDetailsService.clearInfo();

			var url = $scope.basePath;
			url += "script.php?task=userprofile";
			var inputObj = {
				userid: userDetails.userid
			};

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					$scope.userDetailsSbmtData = {};
					$scope.userDetailsFormData.isMorePersonalDetails = false;

					var obj = responseData.data[0];
					var userDetailsSbmtData = {
						userid: (obj.id && parseInt(obj.id)),
						userCategoryID: (obj.user_cat_id && parseInt(obj.user_cat_id)),
						userCategory: obj.user_category,
						firstName: obj.first_name,
						lastName: obj.last_name,
						genderCode: (obj.gender && parseInt(obj.gender)),
						dob: ($filter("date")(obj.dob, "dd-MM-yyyy")),
						placeOfBirth: obj.place_of_birth,
						maritalStatusCode: (obj.marital_status && parseInt(obj.marital_status)),
						mobileNo: (obj.mobile_no && parseInt(obj.mobile_no)),
						altMobileNo: (obj.alt_mobile_no && parseInt(obj.alt_mobile_no)),
						emailID: obj.email_id,
						altEmailID: obj.alt_email_id,
						salary: (obj.salary && $filter("toDecimal", 2)(obj.salary)),
						leaveBalance: (obj.leave_balance && parseInt(obj.leave_balance)),
						extraHoursWorked: (obj.extra_hours_worked && parseInt(obj.extra_hours_worked)),
						presentAddLine1: obj.present_add_line1,
						presentAddLine2: obj.present_add_line2,
						presentAddLandmark: obj.present_add_landmark,
						presentAddCountryCode: (obj.present_add_country_id && parseInt(obj.present_add_country_id)),
						presentAddStateCode: (obj.present_add_state_id && parseInt(obj.present_add_state_id)),
						presentAddDistrictCode: (obj.present_add_district_id && parseInt(obj.present_add_district_id)),
						presentAddPincode: (obj.present_add_pincode && parseInt(obj.present_add_pincode)),
						permanentAddLine1: obj.permanent_add_line1,
						permanentAddLine2: obj.permanent_add_line2,
						permanentAddLandmark: obj.permanent_add_landmark,
						permanentAddCountryCode: (obj.permanent_add_country_id && parseInt(obj.permanent_add_country_id)),
						permanentAddStateCode: (obj.permanent_add_state_id && parseInt(obj.permanent_add_state_id)),
						permanentAddDistrictCode: (obj.permanent_add_district_id && parseInt(obj.permanent_add_district_id)),
						permanentAddPincode: (obj.permanent_add_pincode && parseInt(obj.permanent_add_pincode))
					};

					var userNameAr = [];
					var firstName = userDetailsSbmtData.firstName;
					if(typeof firstName === "string") {
						userNameAr.push(firstName.trim());
					}
					var lastName = userDetailsSbmtData.lastName;
					if(typeof lastName === "string") {
						userNameAr.push(lastName.trim());
					}
					userDetailsSbmtData.fullName = userNameAr.join(" ");

					if(userDetailsSbmtData.genderCode !== undefined) {
						var filterObj = filterData($scope.userDetailsRESTData.genderAr, "id", userDetailsSbmtData.genderCode);
						userDetailsSbmtData.genderName = filterObj.name;
					}

					if(userDetailsSbmtData.maritalStatusCode !== undefined) {
						var filterObj = filterData($scope.userDetailsRESTData.maritalStatusAr, "id", userDetailsSbmtData.maritalStatusCode);
						userDetailsSbmtData.maritalStatusName = filterObj.name;
					}

					if(userDetailsSbmtData.presentAddCountryCode) {
						var filterObj = filterData($scope.userDetailsRESTData.contriesAr, "id", userDetailsSbmtData.presentAddCountryCode);
						userDetailsSbmtData.presentAddCountryName = filterObj.name;
					}

					if(userDetailsSbmtData.permanentAddCountryCode) {
						var filterObj = filterData($scope.userDetailsRESTData.contriesAr, "id", userDetailsSbmtData.permanentAddCountryCode);
						userDetailsSbmtData.permanentAddCountryName = filterObj.name;
					}

					if(userDetailsSbmtData.presentAddStateCode) {
						var filterObj = filterData($scope.userDetailsRESTData.statesAr, "id", userDetailsSbmtData.presentAddStateCode);
						userDetailsSbmtData.presentAddStateName = filterObj.name;
					}

					if(userDetailsSbmtData.permanentAddStateCode) {
						var filterObj = filterData($scope.userDetailsRESTData.statesAr, "id", userDetailsSbmtData.permanentAddStateCode);
						userDetailsSbmtData.permanentAddStateName = filterObj.name;
					}

					if(userDetailsSbmtData.presentAddDistrictCode) {
						var filterObj = filterData($scope.userDetailsRESTData.districtsAr, "id", userDetailsSbmtData.presentAddDistrictCode);
						userDetailsSbmtData.presentAddDistrictName = filterObj.name;
					}

					if(userDetailsSbmtData.permanentAddDistrictCode) {
						var filterObj = filterData($scope.userDetailsRESTData.districtsAr, "id", userDetailsSbmtData.permanentAddDistrictCode);
						userDetailsSbmtData.permanentAddDistrictName = filterObj.name;
					}

					angular.copy(userDetailsSbmtData, $scope.userDetailsSbmtData);
				}
			});
		};

		$scope.editUserDetails = function() {
			var inputObj = {
				userid: $scope.userDetailsSbmtData.userid
			};
			userDetailsService.setInfo(inputObj);
			$state.go("home.users.view.update");
		};
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		$scope.refresh = function() {
			var inputObj = {
				userid: $scope.userDetailsSbmtData.userid
			};
			userDetailsService.setInfo(inputObj);
			$state.go($state.current, {}, { reload: true });
		};
		// <<=
	}
})();