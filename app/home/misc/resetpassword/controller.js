(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("resetPasswordCtrl", resetPasswordCtrl);
	resetPasswordCtrl.$inject = [
		"$scope",
		"$state",
		"userInfoService",
		"infoMessagesFactory",
		"dpConfFactory",
		"restAPIFactory",
		"isArResFactory",
		"userDetailsService"
	];

	function resetPasswordCtrl($scope, $state, userInfoService, infoMessagesFactory, dpConfFactory, restAPIFactory, isArResFactory, userDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.resetPasswordRESTData = {};
			$scope.resetPasswordFormData = {};
			$scope.resetPasswordSbmtData = {};

			$scope.resetPasswordRESTData.uCategoryAr = [];
			$scope.resetPasswordFormData.activetr = null;

			dpConfFactory.format = "DD-MM-YYYY";
			$scope.dateTimePickerConf = JSON.stringify(dpConfFactory);

			$scope.msgObj = {};

			$scope.infoObj = {};
			$scope.infoObj.msg = "Please apply the filter.";
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		var url = $scope.basePath;
		url += "script.php?task=ucategories";
		restAPIFactory("POST", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					var responseAr = [];
					angular.forEach(responseData.data, function(obj) {
						responseAr.push({
							code: parseInt(obj.id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.resetPasswordRESTData.uCategoryAr);
				}
			}
		});
		// <<=

		// Behaviours of the page =>>
		// ==========================
		// Automated methods >>
		$(function() {
			setTimeout(function() {
				var $fdate = $("#fdate");
				var $tdate = $("#tdate");

				var datetimepickerOptions = JSON.parse($fdate.attr("datetimepicker-options"));

				$fdate.datetimepicker(datetimepickerOptions);
				$tdate.datetimepicker(function() {
					var obj = datetimepickerOptions;
					obj.useCurrent = false;
					return obj;
				});

				$fdate.on("dp.change", function (e) {
					$('#tdate').data("DateTimePicker").minDate(e.date);
				});

				$tdate.on("dp.change", function (e) {
					$('#fdate').data("DateTimePicker").maxDate(e.date);
				});
			}, 100);
		});
		// <<

		$scope.searchFormSubmit = function() {
			$scope.infoObj.msg = "Please wait...";
			$scope.tbodyAr = [];

			restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
				if(jsonData.statusText === "OK") {
					$scope.theadAr = jsonData.data[0].usersResetPasswordTHeadAr;

					var url = $scope.basePath;
					url += "script.php?task=view";
					var inputObj = {
						ucategory: ($scope.resetPasswordSbmtData.ucategoryModel || ""),
						uname: ($scope.resetPasswordSbmtData.unameModel || ""),
						fdate: ($scope.resetPasswordSbmtData.fdateModel || ""),
						tdate: ($scope.resetPasswordSbmtData.tdateModel || "")
					};

					if(!Object.keys(inputObj).filter(function(key){ return ("" + inputObj[key]); }).length) {
						$scope.infoObj.msg = "Please apply the filter.";
					} else {
						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							if(responseData.statusText === "OK") {
								if(isArResFactory(responseData)) {
									$scope.infoObj.msg = "";

									var responseAr = [];
									angular.forEach(responseData.data, function(obj) {
										responseAr.push({
											id: (obj.id && parseInt(obj.id)),
											username: obj.username,
											ucategory: obj.ucategory,
											name: obj.name,
											mobileNo: (obj.mobile_no && parseInt(obj.mobile_no)),
											emailID: obj.email_id,
											createdOn: obj.created_on
										});
									});
									angular.copy(responseAr, $scope.tbodyAr);

									$scope.orderBy = "createdOn";
									$scope.orderByDir = true;
									$scope.sortColumn = function(code) {
										$scope.orderBy = code;
										$scope.orderByDir = !$scope.orderByDir;
									};
								} else {
									$scope.infoObj.msg = "No records found.";
								}
							} else {
								$scope.infoObj.msg = "Something went wrong.";
							}
						});
					}
				} else {
					$scope.infoObj.msg = "Something went wrong.";
				}
			});
		};

		$scope.viewUserDetails = function(userid) {
			var inputObj = {
				userid: userid
			};
			userDetailsService.setInfo(inputObj);
			$state.go("home.users.view.details");
		};

		$scope.resetPassword = function(obj) {
			var msg = '';
			msg += '<div class="margin-bottom">Are you sure to reset the password for <strong>' + obj.name + '</strong>?</div>';
			msg += '<div class="text-primary">';
				msg += '<small>';
					msg += '<span class="glyphicon glyphicon-info-sign"></span>';
					msg += '<em>The password will be reset to <kbd>password</kbd>.</em>';
				msg += '</small>';
			msg += '</div>';

			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Reset Password",
						className: "btn-warning"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						resetPassword(obj);
					}
				}
			});
		};

		function resetPassword(obj) {
			$scope.msgObj = {};

			var url = $scope.basePath;
			url += "script.php?task=resetpassword";
			var inputObj = {
				userid: parseInt(obj.id)
			};

			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("PUT", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.msgObj);
							$scope.msgObj.msg = "Reset the password successfully.";
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.msgObj);
							$scope.msgObj.msg = "Error while resetting the password.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.msgObj);
					$scope.msgObj.title += " (" + responseData.status + ")";
					$scope.msgObj.msg = responseData.statusText;
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