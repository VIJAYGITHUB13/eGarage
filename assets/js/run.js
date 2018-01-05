// Application definition with routing technique and initial point
(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.run(eGarageAppRun);

	function eGarageAppRun($window, $rootScope, $state, restAPIFactory) {
		$window.onload = function() {
			if(sessionStorage.getItem("logInFlag") === "true") {
				sessionStorage.removeItem("logInFlag");
				$window.location = ($window.location.origin + $window.location.pathname);
			}
		};

		$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
			$rootScope.prevState = fromState.name;
			
			restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
				if(jsonData.statusText === "OK") {
					angular.forEach(jsonData.data[0].statesAr, function(ngVal) {
						angular.forEach(ngVal.paths, function(val) {
							if(val === toState.name) {
								$state.go(ngVal.default);
							}
						});
					});
				}
			});
		});
	}
})();