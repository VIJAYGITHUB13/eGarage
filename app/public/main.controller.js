(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("publicMainCtrl", publicMainCtrl);
	publicMainCtrl.$inject = [
		"$scope",
		"$state",
		"userInfoService",
		"infoMessagesFactory",
		"restAPIFactory",
		"isArResFactory"
	];

	function publicMainCtrl($scope, $state, userInfoService, infoMessagesFactory, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;

		function initObjs() {
			$scope.publicMainRESTData = {};
			$scope.publicMainFormData = {};
			$scope.publicMainSbmtData = {};

			$scope.publicMainRESTData.tagLine = "Treasure of Knowledge to empower the Professionalism";
			$scope.publicMainFormData.isSignin = true;
			$scope.publicMainFormData.signinInfoObj = {};
			$scope.publicMainFormData.signupInfoObj = {};

			$scope.publicMainSbmtData.signinObj = {};
			$scope.publicMainSbmtData.signupObj = {};
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		// <<=
		
		// Behaviours of the page =>>
		// ==========================
		$scope.signinSubmit = function() {
			$scope.publicMainFormData.signinInfoObj = {};
			
			if($scope.signinForm.$valid) {
				var inputObj = {
					uname: ($scope.publicMainSbmtData.signinObj.unameModel || ""),
					pwd: ($scope.publicMainSbmtData.signinObj.pwdModel || "")
				};

				var url = $scope.basePath;
				url += "main.script.php?task=signin";
				restAPIFactory("POST", url, inputObj).post(function(responseData) {
					if(responseData.statusText === "OK") {
						switch(responseData.data) {
							case "UNAUTHORISED":
								angular.copy(infoMessagesFactory.info, $scope.publicMainFormData.signinInfoObj);
								$scope.publicMainFormData.signinInfoObj.msg = "Unauthorised user.";
							break;

							case "INVALID":
								angular.copy(infoMessagesFactory.info, $scope.publicMainFormData.signinInfoObj);
								$scope.publicMainFormData.signinInfoObj.msg = "Please provide valid credentials.";
							break;

							case "ERROR_DB":
								angular.copy(infoMessagesFactory.danger, $scope.publicMainFormData.signinInfoObj);
								$scope.publicMainFormData.signinInfoObj.msg = "Error signing in.";
							break;

							default:
								if(isArResFactory(responseData)) {
									userInfoService.setInfo(responseData.data[0]);
									sessionStorage.setItem("logInFlag", "true");
									$state.go("home");
								} else {
									angular.copy(infoMessagesFactory.danger, $scope.publicMainFormData.signinInfoObj);
									$scope.publicMainFormData.signinInfoObj.msg = "Error signing in.";
								}
							break;
						}
					} else {
						angular.copy(infoMessagesFactory.danger, $scope.publicMainFormData.signinInfoObj);
						$scope.publicMainFormData.signinInfoObj.msg = "Error signing in.";
					}
				});
			}
		};
		
		$scope.signupSubmit = function() {
			$scope.publicMainFormData.signupInfoObj = {};
			
			if($scope.signupForm.$valid) {
				var inputObj = {
					uname: ($scope.publicMainSbmtData.signupObj.unameModel || ""),
					mobile_no: ($scope.publicMainSbmtData.signupObj.mobileNoModel || ""),
					email_id: ($scope.publicMainSbmtData.signupObj.ngEmailIDMdl || ""),
					comments: ($scope.publicMainSbmtData.signupObj.commentsModel || "")
				};

				var url = $scope.basePath;
				url += "main.script.php?task=signup";
				restAPIFactory("POST", url, inputObj).post(function(responseData) {
					if(responseData.statusText === "OK") {
						switch(responseData.data) {
							case "ALREADY_EXISTS":
								angular.copy(infoMessagesFactory.info, $scope.publicMainFormData.signupInfoObj);
								$scope.publicMainFormData.signupInfoObj.msg = "The user already exists.";
							break;

							case "ERROR_DB":
								angular.copy(infoMessagesFactory.danger, $scope.publicMainFormData.signupInfoObj);
								$scope.publicMainFormData.signupInfoObj.msg = "Error signing up.";
							break;

							case "SUCCESS":
								$scope.publicMainSbmtData.signupObj = {};
								$scope.signupForm.$setPristine();

								angular.copy(infoMessagesFactory.success, $scope.publicMainFormData.signupInfoObj);
								$scope.publicMainFormData.signupInfoObj.msg = "Thank you for signing up.";
							break;

							default:
								$scope.publicMainSbmtData.signupObj = {};
								angular.copy(infoMessagesFactory.info, $scope.publicMainFormData.signupInfoObj);
								$scope.publicMainFormData.signupInfoObj.msg = "Something went wrong.";
							break;
						}
					} else {
						angular.copy(infoMessagesFactory.danger, $scope.publicMainFormData.signupInfoObj);
						$scope.publicMainFormData.signupInfoObj.msg = "Error signing up.";
					}
				});
			}
		};
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		$scope.refreshModule = function(type) {
			switch(type) {
				case "signin":
					$scope.publicMainFormData.isSignin = true;
					$scope.signupForm.$setPristine();
					$scope.publicMainSbmtData.signupObj = {};
					$scope.publicMainFormData.signupInfoObj = {};
				break;

				case "signup":
					$scope.publicMainFormData.isSignin = false;
					$scope.signinForm.$setPristine();
					$scope.publicMainSbmtData.signinObj = {};
					$scope.publicMainFormData.signinInfoObj = {};
				break;
			}
		};
		// <<=
	}
})();