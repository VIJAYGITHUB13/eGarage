(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("changePasswordCtrl", changePasswordCtrl);
	changePasswordCtrl.$inject = [
		"$scope",
		"$state",
		"userInfoService",
		"infoMessagesFactory",
		"restAPIFactory",
		"isArResFactory"
	];

	function changePasswordCtrl($scope, $state, userInfoService, infoMessagesFactory, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.changePasswordRESTData = {};
			// $scope.changePasswordFormData = {};
			$scope.changePasswordSbmtData = {};

			$scope.infoObj = {};
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		function fetchDetails() {
			var url = $scope.basePath;
			url += "script.php?task=details";

			var inputObj = {};
			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					if(isArResFactory(responseData)) {
						$scope.changePasswordRESTData.name = responseData.data[0].name;
						$scope.changePasswordRESTData.userName = responseData.data[0].username;
					}
				}
			});
		}
		fetchDetails();
		// <<=

		// Behaviours of the page =>>
		// ==========================
		$scope.changePasswordFormSbmt = function() {
			$scope.infoObj = {};

			var passwordModel = $scope.changePasswordSbmtData.passwordModel;
			var confirmPasswordModel = $scope.changePasswordSbmtData.confirmPasswordModel;

			if(passwordModel === confirmPasswordModel) {
				var url = $scope.basePath;
				url += "script.php?task=changepassword";

				var inputObj = {};
				inputObj.passwordModel = passwordModel;

				var userInfo = userInfoService.getInfo();
				inputObj.myid = userInfo.uid;

				restAPIFactory("POST", url, inputObj).post(function(responseData) {
					if(responseData.statusText === "OK") {
						switch(responseData.data) {
							case "SUCCESS":
								angular.copy(infoMessagesFactory.success, $scope.infoObj);
								$scope.infoObj.msg = "Changed the password successfully.";
							break;

							case "ERROR_DB":
								angular.copy(infoMessagesFactory.danger, $scope.infoObj);
								$scope.infoObj.msg = "Error while changing the password.";
							break;
						}
					} else {
						angular.copy(infoMessagesFactory.danger, $scope.infoObj);
						$scope.infoObj.title += (" (" + responseData.status + ")");
						$scope.infoObj.msg = responseData.statusText;
					}
				});
			} else {
				angular.copy(infoMessagesFactory.danger, $scope.infoObj);
				$scope.infoObj.msg = "Confirm Password didn't matched with Password.";
			}
		};
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		$scope.reset = function() {
			$state.go($state.current, {}, { reload: true });
		};
		// <<=
	}
})();