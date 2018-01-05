(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("homeMainCtrl", homeMainCtrl);
	homeMainCtrl.$inject = [
		"$scope",
		"$state",
		"userInfoService",
		"restAPIFactory",
		"isArResFactory"
	];

	function homeMainCtrl($scope, $state, userInfoService, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;

		function initObjs() {
			$scope.homeMainRESTData = {};
			$scope.homeMainFormData = {};
			// $scope.homeMainSbmtData = {};

			$scope.homeMainRESTData.stats = {};

			$scope.homeMainFormData.isFirstTimeVisit = false;
			$scope.homeMainFormData.isStats = false;

			$scope.homeMainFormData.colorsAr = [];
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		function canStats() {
			var userInfo = userInfoService.getInfo();
			var ucategory = parseInt(userInfo.ucategory);

			return ([1, 2].indexOf(ucategory) !== -1);
		}

		function randomColors() {
			var colorsAr = ["rgba(86, 61, 124, 0.90)", "#8a6d3b", "#3c763d", "#a94442", "#777", "#31708f"];

			var shuffledAr = [];
			while(colorsAr.length > 0) {
				var ind = (Math.floor(Math.random() * colorsAr.length));
				shuffledAr.push(colorsAr[ind]);
				colorsAr.splice(ind, 1);
			}

			$scope.homeMainFormData.colorsAr = [];
			angular.copy(shuffledAr, $scope.homeMainFormData.colorsAr);
		}

		function fetchStats() {
			var url = $scope.basePath;
			url += "main.script.php?task=stats";
			restAPIFactory("GET", url, {}).post(function(responseData) {
				if(responseData.statusText === "OK") {
					if(isArResFactory(responseData)) {
						var resObj = responseData.data[0];

						var statsObj = {};
						statsObj.reqsOpen = ((resObj.requests_open && parseInt(resObj.requests_open)) || 0);
						statsObj.reqsInprogress = ((resObj.requests_inprogress && parseInt(resObj.requests_inprogress)) || 0);
						statsObj.reqsClosed = ((resObj.requests_closed && parseInt(resObj.requests_closed)) || 0);

						statsObj.clients = ((resObj.clients && parseInt(resObj.clients)) || 0);
						statsObj.employees = ((resObj.employees && parseInt(resObj.employees)) || 0);
						statsObj.storageItems = ((resObj.storage_items && parseInt(resObj.storage_items)) || 0);
						
						randomColors();
						angular.copy(statsObj, $scope.homeMainRESTData.stats);
					}
				}
			});
		}

		function getVisitingCount() {
			var url = $scope.basePath;
			url += "main.script.php?task=visitingcount";

			var inputObj = {};
			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					if(isArResFactory(responseData)) {
						var resObj = responseData.data[0];
						$scope.homeMainRESTData.name = (resObj.name || "");

						var visitingCount = ((resObj.visiting_count && parseInt(resObj.visiting_count)) || 0);
						$scope.homeMainFormData.isFirstTimeVisit = (visitingCount === 1);
						
						var isStats = canStats();
						$scope.homeMainFormData.isStats = isStats;

						(isStats && fetchStats());
					}
				}
			});
		}
		getVisitingCount();
		// <<=

		// Behaviours of the page =>>
		// ==========================
		// Automated methods >>
		// <<
		$scope.canStats = function() {
			return canStats();
		};
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		// <<=
	}
})();