(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("aboutUsCtrl", aboutUsCtrl);
	aboutUsCtrl.$inject = ["$scope", "$state"];

	function aboutUsCtrl($scope, $state) {
		// Objects decleration =>>
		// =======================
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;
		// <<=
	}
})();