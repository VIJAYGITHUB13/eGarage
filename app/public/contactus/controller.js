(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("contactUsCtrl", contactUsCtrl);
	contactUsCtrl.$inject = ["$scope", "$state"];

	function contactUsCtrl($scope, $state) {
		// Objects decleration =>>
		// =======================
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;
		// <<=
	}
})();