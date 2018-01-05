(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("myProfileCtrl", myProfileCtrl);
	myProfileCtrl.$inject = [
		"$scope",
		"$state",
		"$filter",
		"userInfoService",
		"alertInfoService",
		"restAPIFactory",
		"isArResFactory"
	];

	function myProfileCtrl($scope, $state, $filter, userInfoService, alertInfoService, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.myProfileRESTData = {};
			$scope.myProfileFormData = {};
			$scope.myProfileSbmtData = {};

			$scope.myProfileRESTData.genderAr = [];
			$scope.myProfileRESTData.maritalStatusAr = [];
			$scope.myProfileRESTData.contriesAr = [];
			$scope.myProfileRESTData.statesAr = [];
			$scope.myProfileRESTData.districtsAr = [];

			$scope.myProfileFormData.isMorePersonalDetails = false;
			$scope.myProfileFormData.areEmployeeDetails = false;

			$scope.infoObj = {};
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
			if(jsonData.statusText === "OK") {
				var jsonObj = jsonData.data[0];
				$scope.myProfileRESTData.genderAr = jsonObj.genderAr;
				$scope.myProfileRESTData.maritalStatusAr = jsonObj.maritalStatusAr;
			}
		});

		var url = $scope.basePath;
		url += "script.php?task=addressinputs";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					angular.copy(formatResAr(responseData.data[0]), $scope.myProfileRESTData.contriesAr);
					angular.copy(formatResAr(responseData.data[1]), $scope.myProfileRESTData.statesAr);
					angular.copy(formatResAr(responseData.data[2]), $scope.myProfileRESTData.districtsAr);

					fetchMyProfile();
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

		function fetchMyProfile() {
			$scope.infoObj = {};
			var alertInfo = alertInfoService.getInfo();
			if(alertInfo !== undefined) {
				if(Object.keys(alertInfo).length) {
					angular.copy(alertInfo, $scope.infoObj);
					alertInfoService.clearInfo();
				}
			}
			
			var userInfo = userInfoService.getInfo();

			var url = $scope.basePath;
			url += "script.php?task=myprofile";
			var inputObj = {
				myid: userInfo.uid
			};

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					$scope.myProfileSbmtData = {};
					$scope.myProfileFormData.isMorePersonalDetails = false;

					var obj = responseData.data[0];
					var myProfileSbmtData = {
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

					var myNameAr = [];
					var firstName = myProfileSbmtData.firstName;
					if(typeof firstName === "string") {
						myNameAr.push(firstName.trim());
					}
					var lastName = myProfileSbmtData.lastName;
					if(typeof lastName === "string") {
						myNameAr.push(lastName.trim());
					}
					myProfileSbmtData.fullName = myNameAr.join(" ");

					if(myProfileSbmtData.genderCode !== undefined) {
						var filterObj = filterData($scope.myProfileRESTData.genderAr, "id", myProfileSbmtData.genderCode);
						myProfileSbmtData.genderName = filterObj.name;
					}

					if(myProfileSbmtData.maritalStatusCode !== undefined) {
						var filterObj = filterData($scope.myProfileRESTData.maritalStatusAr, "id", myProfileSbmtData.maritalStatusCode);
						myProfileSbmtData.maritalStatusName = filterObj.name;
					}

					if(myProfileSbmtData.presentAddCountryCode) {
						var filterObj = filterData($scope.myProfileRESTData.contriesAr, "id", myProfileSbmtData.presentAddCountryCode);
						myProfileSbmtData.presentAddCountryName = filterObj.name;
					}

					if(myProfileSbmtData.permanentAddCountryCode) {
						var filterObj = filterData($scope.myProfileRESTData.contriesAr, "id", myProfileSbmtData.permanentAddCountryCode);
						myProfileSbmtData.permanentAddCountryName = filterObj.name;
					}

					if(myProfileSbmtData.presentAddStateCode) {
						var filterObj = filterData($scope.myProfileRESTData.statesAr, "id", myProfileSbmtData.presentAddStateCode);
						myProfileSbmtData.presentAddStateName = filterObj.name;
					}

					if(myProfileSbmtData.permanentAddStateCode) {
						var filterObj = filterData($scope.myProfileRESTData.statesAr, "id", myProfileSbmtData.permanentAddStateCode);
						myProfileSbmtData.permanentAddStateName = filterObj.name;
					}

					if(myProfileSbmtData.presentAddDistrictCode) {
						var filterObj = filterData($scope.myProfileRESTData.districtsAr, "id", myProfileSbmtData.presentAddDistrictCode);
						myProfileSbmtData.presentAddDistrictName = filterObj.name;
					}

					if(myProfileSbmtData.permanentAddDistrictCode) {
						var filterObj = filterData($scope.myProfileRESTData.districtsAr, "id", myProfileSbmtData.permanentAddDistrictCode);
						myProfileSbmtData.permanentAddDistrictName = filterObj.name;
					}

					angular.copy(myProfileSbmtData, $scope.myProfileSbmtData);
				}
			});
		};
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		$scope.refresh = function() {
			$state.go($state.current, {}, { reload: true });
		};
		// <<=
	}
})();