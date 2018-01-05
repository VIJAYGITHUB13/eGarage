(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("publicCtrl", publicCtrl);
	publicCtrl.$inject = ["$scope", "$state", "appInfoService", "restAPIFactory", "isArResFactory"];

	function publicCtrl($scope, $state, appInfoService, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;

		function initObjs() {
			$scope.publicRESTData = {};
			$scope.publicFormData = {};
			$scope.publicSbmtData = {};

			$scope.publicFormData.dateTime = (new Date().getTime());
			$scope.publicRESTData.menusAr = [];
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		var url = $scope.basePath;
		url += "script.php?task=app_details";
		restAPIFactory("POST", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					var appDetails = responseData.data[0];
					appInfoService.setInfo(appDetails);

					$scope.publicFormData.appName = appDetails.app_name;
					$scope.publicFormData.appBand = (appDetails.app_band || "eG");
					$scope.publicFormData.appVersion = (appDetails.app_version ? ("Version " + appDetails.app_version) :  "");
				}
			}
		});

		var url = $scope.basePath;
		url += "script.php?task=menus";
		restAPIFactory("POST", url, {}).post(function(responseData) {
			$scope.publicRESTData.menusAr = [];

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
					angular.copy(responseAr, $scope.publicRESTData.menusAr);
				}
			}
		});
		// <<=

		// Behaviours of the page =>>
		// ==========================
		// <<=
	}
})();