(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("usersViewCtrl", usersViewCtrl);
	usersViewCtrl.$inject = [
		"$scope",
		"$state",
		"infoMessagesFactory",
		"dpConfFactory",
		"restAPIFactory",
		"isArResFactory",
		"userDetailsService"
	];

	function usersViewCtrl($scope, $state, infoMessagesFactory, dpConfFactory, restAPIFactory, isArResFactory, userDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.usersViewRESTData = {};
			// $scope.usersViewFormData = {};
			$scope.usersViewSbmtData = {};

			$scope.usersViewRESTData.uCategoryAr = [];

			dpConfFactory.format = "DD-MM-YYYY";
			$scope.dateTimePickerConf = JSON.stringify(dpConfFactory);

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
					angular.copy(responseAr, $scope.usersViewRESTData.uCategoryAr);
					$scope.usersViewSbmtData.ucategoryModel = 3;
					$scope.searchFormSubmit();
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
					$scope.theadAr = jsonData.data[0].usersTHeadAr;

					var url = $scope.basePath;
					url += "script.php?task=view";
					var inputObj = {
						ucategory: ($scope.usersViewSbmtData.ucategoryModel || ""),
						uname: ($scope.usersViewSbmtData.unameModel || ""),
						fdate: ($scope.usersViewSbmtData.fdateModel || ""),
						tdate: ($scope.usersViewSbmtData.tdateModel || "")
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
											createdOn: obj.created_on,
											isBlocked: (obj.is_blocked && parseInt(obj.is_blocked))
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

		$scope.updateUserDetails = function(userid) {
			var inputObj = {
				userid: userid
			};
			userDetailsService.setInfo(inputObj);
			$state.go("home.users.view.update");
		};

		$scope.blockUser = function(obj) {
			var msg = '';
			msg += '<div class="margin-bottom">Are you sure to block the user <strong>' + obj.username + '</strong>?</div>';
			msg += '<div class="text-danger">';
				msg += '<small>';
					msg += '<span class="glyphicon glyphicon-info-sign"></span>';
					msg += '<em style="margin-left: 5px;">The user will no longer be able to log in.</em>';
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
						label: "Block User",
						className: "btn-danger"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						blockUser(obj);
					}
				}
			});
		};

		function blockUser(obj) {
			$scope.msgObj = {};

			var url = $scope.basePath;
			url += "script.php?task=block";
			var inputObj = {
				userID: parseInt(obj.id)
			};

			restAPIFactory("PUT", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.msgObj);
							$scope.msgObj.msg = "Blocked the user successfully.";
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.msgObj);
							$scope.msgObj.msg = "Error while blocking the user.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.msgObj);
					$scope.msgObj.title += " (" + responseData.status + ")";
					$scope.msgObj.msg = responseData.statusText;
				}

				$scope.searchFormSubmit();
			});
		};

		$scope.unblockUser = function(obj) {
			var msg = '';
			msg += '<div class="margin-bottom">Are you sure to unblock the user <strong>' + obj.username + '</strong>?</div>';
			msg += '<div class="text-primary">';
				msg += '<small>';
					msg += '<span class="glyphicon glyphicon-info-sign"></span>';
					msg += '<em style="margin-left: 5px;">The user will be able to log in.</em>';
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
						label: "Unblock User",
						className: "btn-success"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						unblockUser(obj);
					}
				}
			});
		};

		function unblockUser(obj) {
			$scope.msgObj = {};

			var url = $scope.basePath;
			url += "script.php?task=unblock";
			var inputObj = {
				userID: parseInt(obj.id)
			};

			restAPIFactory("PUT", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.msgObj);
							$scope.msgObj.msg = "Unblocked the user successfully.";
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.msgObj);
							$scope.msgObj.msg = "Error while unblocking the user.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.msgObj);
					$scope.msgObj.title += " (" + responseData.status + ")";
					$scope.msgObj.msg = responseData.statusText;
				}

				$scope.searchFormSubmit();
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