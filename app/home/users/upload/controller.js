(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("userUploadCtrl", userUploadCtrl);
	userUploadCtrl.$inject = [
		"$scope",
		"$state",
		"appInfoService",
		"userInfoService",
		"infoMessagesFactory",
		"restAPIFactory",
		"isArResFactory",
		"userUploadService",
		"userUploadFileService"
	];

	function userUploadCtrl($scope, $state, appInfoService, userInfoService, infoMessagesFactory, restAPIFactory, isArResFactory, userUploadService, userUploadFileService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.userUploadRESTData = {};
			// $scope.userUploadFormData = {};
			$scope.userUploadSbmtData = {};

			$scope.userUploadRESTData.userCategoriesAr = [];

			$scope.infoObj = {};
			userUploadService.clearInfo();
			userUploadFileService.clearInfo();
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		var url = $scope.basePath;
		url += "script.php?task=usercategories";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					var responseAr = [];
					angular.forEach(responseData.data, function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.userUploadRESTData.userCategoriesAr);
				}
			}
		});
		// <<=

		// Behaviours of the page =>>
		// ==========================
		// Automated methods >>
		function filterData(inputAr, inputKey, inputVal) {
			if(inputAr !== undefined) {
				return inputAr.filter(function(obj) {
					return (obj[inputKey] === inputVal);
				});
			} else {
				return [];
			}
		};
		// <<

		$scope.userUploadFormSbmt = function() {
			$scope.infoObj = {};

			var appInfoObj = appInfoService.getInfo();
			var appacronym = (appInfoObj.app_band || "APP");

			var formData = new FormData();
			formData.append("file", $("#file")[0].files[0]);

			var userInfo = userInfoService.getInfo();
			var ucategory = userInfo.ucategory;
			var uid = userInfo.uid;

			var url = "";
			url += $scope.basePath;
			url += "parser.php";
			url += ("?appacronym=" + appacronym);
			url += ("&ucategory=" + ucategory);
			url += ("&uid=" + uid);

			$.ajax({
				url:  url,
				type: "POST",
				data: formData,
				processData: false, // restricting jQuery on processing the data
				contentType: false,  // restricting jQuery on setting up contentType
				success: function(responseData) {
					if(responseData === "ALREADY_EXISTS") {
						angular.copy(infoMessagesFactory.info, $scope.infoObj);
						$scope.infoObj.msg = "Please retry after a while.";
					} else {
						var userCategoryObj = filterData($scope.userUploadRESTData.userCategoriesAr, "id", $scope.userUploadSbmtData.userCategoryModel)[0];
						userUploadService.setInfo(userCategoryObj);
						userUploadFileService.setInfo(JSON.parse(responseData));

						$state.go("home.users.upload.confirm");
					}
				},
				error: function(errorData) {
					angular.copy(infoMessagesFactory.danger, $scope.infoObj);
					$scope.infoObj.title += (" (" + errorData.status + ")");
					$scope.infoObj.msg = errorData.statusText;
				}
			});
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