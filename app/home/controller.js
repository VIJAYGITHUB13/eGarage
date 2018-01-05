(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("homeCtrl", homeCtrl);
	homeCtrl.$inject = ["$scope", "$state", "userInfoService", "estdInfoService", "restAPIFactory", "isArResFactory", "userDetailsService"];

	function homeCtrl($scope, $state, userInfoService, estdInfoService, restAPIFactory, isArResFactory, userDetailsService) {
		// Objects decleration =>>
		// =======================
		// $scope.basePath = $state.current.data.basePath;
		$scope.basePath = "app/home/";

		function initObjs() {
			$scope.homeRESTData = {};
			$scope.homeFormData = {};
			$scope.homeSbmtData = {};

			$scope.homeFormData.dateTime = (new Date().getTime());
			$scope.homeRESTData.menusAr = [];

			var userInfo = userInfoService.getInfo();
			if(userInfo !== undefined) {
				$scope.homeFormData.uname = (userInfo.uname || "Unknown");
				$scope.homeFormData.usubcategory = ((userInfo.usubcategory && parseInt(userInfo.usubcategory)) || 0);
			}
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		var url = $scope.basePath;
		url += "script.php?task=appdetails";
		restAPIFactory("POST", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					var appDetails = responseData.data[0];

					$scope.homeFormData.appName = appDetails.app_name;
					$scope.homeFormData.appBand = (appDetails.app_band || "eG");
					$scope.homeFormData.appVersion = (appDetails.app_version ? ("Version " + appDetails.app_version) :  "");
				}
			}
		});

		// Being called in home/misc/establishment/controller.js
		$scope.getEstdDetails = function() {
			var url = $scope.basePath;
			url += "script.php?task=estddetails";
			restAPIFactory("POST", url, {}).post(function(responseData) {
				if(responseData.statusText === "OK") {
					if(isArResFactory(responseData)) {
						var appDetails = responseData.data[0];
						estdInfoService.setInfo(appDetails);

						$scope.homeFormData.estdName = appDetails.name;
					}
				}
			});
		};
		$scope.getEstdDetails();
		
		if($scope.homeFormData.usubcategory) {
			var inputObj = {
				usubcategory: $scope.homeFormData.usubcategory
			};

			var url = $scope.basePath;
			url += "script.php?task=menus";
			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				$scope.homeRESTData.menusAr = [];

				if(responseData.statusText === "OK") {
					if(isArResFactory(responseData)) {
						var responseAr = [];
						angular.forEach(responseData.data, function(obj) {
							var subMenusAr = [];
							if(obj.subMenusAr !== undefined) {
								if(obj.subMenusAr.length) {
									angular.forEach(obj.subMenusAr, function(subObj) {
										subMenusAr.push({
											displayName: subObj.display_name,
											path: subObj.path,
											rwd: subObj.rwd
										});
									});
								}
							}

							responseAr.push({
								displayName: obj.display_name,
								path: obj.path,
								rwd: obj.rwd,
								subMenusAr: subMenusAr
							});
						});
						angular.copy(responseAr, $scope.homeRESTData.menusAr);
					}
				}
			});
		}
		// <<=

		// Behaviours of the page =>>
		// ==========================
		// <<=
	}
})();