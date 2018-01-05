(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("establishmentCtrl", establishmentCtrl);
	establishmentCtrl.$inject = [
		"$scope",
		"$state",
		"$http",
		"$sce",
		"userInfoService",
		"infoMessagesFactory",
		"restAPIFactory",
		"isArResFactory"
	];

	function establishmentCtrl($scope, $state, $http, $sce, userInfoService, infoMessagesFactory, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.establishmentRESTData = {};
			$scope.establishmentFormData = {};
			$scope.establishmentSbmtData = {};

			$scope.infoObj = {};
			fileInfo();
		}
		initObjs();

		function fileInfo() {
			var tpl = '';
			tpl += '<div>Max file size allowed: 2MB</div>';
			tpl += '<div>File formats: jpg, JPG, jpeg, JPEG, png, PNG, gif, GIF, bmp, BMP</div>';
			$scope.establishmentFormData.fileInfo = $sce.trustAsHtml(tpl);
		}
		// <<=

		// Rest calls for the page =>>
		// ===========================
		function fetchDetails() {
			var url = $scope.basePath;
			url += "script.php?task=details";

			restAPIFactory("GET", url, {}).post(function(responseData) {
				if(responseData.statusText === "OK") {
					if(isArResFactory(responseData)) {
						$scope.establishmentSbmtData.nameModel = responseData.data[0].name;
						$scope.establishmentSbmtData.addressModel = responseData.data[0].address;
						$scope.establishmentSbmtData.contactModel = responseData.data[0].contact;
					}
				}
			});

			var url = $scope.basePath;
			url += "script.php?task=logo";

			restAPIFactory("GET", url, {}).post(function(responseData) {
				if(responseData.statusText === "OK") {
					$scope.establishmentSbmtData.logoModel = (responseData.data || "download.png");
				}
			});
		}
		fetchDetails();
		// <<=

		// Behaviours of the page =>>
		// ==========================
		$scope.establishmentFormSbmt = function() {
			$scope.infoObj = {};

			var url = $scope.basePath;
			url += "script.php?task=update";

			var inputObj = {};
			inputObj.nameModel = $scope.establishmentSbmtData.nameModel;
			inputObj.addressModel = $scope.establishmentSbmtData.addressModel;
			inputObj.contactModel = $scope.establishmentSbmtData.contactModel;

			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.infoObj);
							$scope.infoObj.msg = "Updated the details successfully.";

							$scope.$parent.getEstdDetails();
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.infoObj);
							$scope.infoObj.msg = "Error while updating the details.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.infoObj);
					$scope.infoObj.title += (" (" + responseData.status + ")");
					$scope.infoObj.msg = responseData.statusText;
				}
			});
		};

		// Code for logo upload >>
		// -----------------------
		$scope.form = [];
		$scope.files = [];

		$scope.logoUploadFormSbmt = function() {
			$scope.infoObj = {};
			$scope.form.image = $scope.files[0];

			var url = $scope.basePath;
			url += "script.php?task=upload";

			$http({
				method: "POST",
				url: url,
				processData: false,
				transformRequest: function(data) {
					var formData = new FormData();
					formData.append("image", $scope.form.image);  
					return formData;  
				},  
				data: $scope.form,
				headers: {
					"Content-Type": undefined
				}
			}).success(function(responseData) {
				switch(responseData) {
					case "SUCCESS":
						angular.copy(infoMessagesFactory.success, $scope.infoObj);
						$scope.infoObj.msg = "Uploaded the logo successfully.";

						fetchDetails();
					break;

					case "ERROR_UPLOAD":
						angular.copy(infoMessagesFactory.danger, $scope.infoObj);
						$scope.infoObj.msg = "Error while uploading the logo.";
					break;

					case "ERROR_FILE_SIZE":
						angular.copy(infoMessagesFactory.danger, $scope.infoObj);
						$scope.infoObj.msg = "Max allowed file size 2MB.";
					break;

					case "ERROR_FILE_FORMAT":
						angular.copy(infoMessagesFactory.danger, $scope.infoObj);
						$scope.infoObj.msg = "Invalid file format.";
					break;

					case "ERROR_NO_FILE":
						angular.copy(infoMessagesFactory.danger, $scope.infoObj);
						$scope.infoObj.msg = "No file chosen.";
					break;
				}
			});
		};

		$scope.previewUploadedLogo = function(element) {
			$scope.currentFile = element.files[0];
			var reader = new FileReader();

			reader.onload = function(event) {
				$scope.logoUploaded = event.target.result
				$scope.$apply(function($scope) {
					$scope.files = element.files;
				});
			}
			reader.readAsDataURL(element.files[0]);
		};
		// <<
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		$scope.reset = function() {
			$state.go($state.current, {}, { reload: true });
		};
		// <<=
	}
})();