(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("requestsViewCtrl", requestsViewCtrl);
	requestsViewCtrl.$inject = [
		"$scope",
		"$state",
		"dpConfFactory",
		"infoMessagesFactory",
		"userInfoService",
		"paginationConfFactory",
		"restAPIFactory",
		"isArResFactory",
		"requestDetailsService"
	];

	function requestsViewCtrl($scope, $state, dpConfFactory, infoMessagesFactory, userInfoService, paginationConfFactory, restAPIFactory, isArResFactory, requestDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.requestsViewRESTData = {};
			// $scope.requestsViewFormData = {};
			$scope.requestsViewSbmtData = {};

			$scope.requestsViewRESTData.statusesAr = [];
			$scope.requestsViewRESTData.assigneesAr = [];

			dpConfFactory.format = "DD-MM-YYYY";
			$scope.dateTimePickerConf = JSON.stringify(dpConfFactory);
			$scope.noofPages = paginationConfFactory.noofPages;
			$scope.currentPage = paginationConfFactory.currentPage;

			$scope.infoObj = {};
			$scope.infoObj.msg = "Please apply the filter.";
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		var url = $scope.basePath;
		url += "script.php?task=statuses";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					var responseAr = [];
					angular.forEach(responseData.data, function(obj) {
						responseAr.push({
							code: parseInt(obj.id),
							name: obj.name,
							cssBorderColor: obj.css_border_color,
							cssColor: obj.css_color
						});
					});
					angular.copy(responseAr, $scope.requestsViewRESTData.statusesAr);
					$scope.requestsViewSbmtData.statusModel = 3;
					$scope.searchFormSubmit();
				}
			}
		});

		var url = $scope.basePath;
		url += "script.php?task=assignees";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					var responseAr = [];
					angular.forEach(responseData.data, function(obj) {
						responseAr.push({
							code: parseInt(obj.id),
							name: obj.name
						});
					});
					angular.copy(responseAr, $scope.requestsViewRESTData.assigneesAr);
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
					$scope.rSearchColAr = jsonData.data[0].requestsTHeadAr;

					var url = $scope.basePath;
					url += "script.php?task=view";
					var inputObj = {
						requestID: ($scope.requestsViewSbmtData.requestIDModel || 0),
						mobileNo: ($scope.requestsViewSbmtData.mobileNoModel || 0),
						status: ($scope.requestsViewSbmtData.statusModel || 0),
						assignee: ($scope.requestsViewSbmtData.assigneeModel || 0),
						fdate: ($scope.requestsViewSbmtData.fdateModel || ""),
						tdate: ($scope.requestsViewSbmtData.tdateModel || "")
					};

					if(!Object.keys(inputObj).filter(function(key){ return inputObj[key]; }).length) {
						$scope.infoObj.msg = "Please apply the filter.";
					} else {
						var userInfo = userInfoService.getInfo();
						inputObj.myid = parseInt(userInfo.uid);
						inputObj.ucategory = parseInt(userInfo.ucategory);

						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							if(responseData.statusText === "OK") {
								if(isArResFactory(responseData)) {
									$scope.infoObj.msg = "";

									var responseAr = [];
									angular.forEach(responseData.data, function(obj) {
										responseAr.push({
											id: (obj.id && parseInt(obj.id)),
											requestID: obj.request_id,
											statusID: (obj.status_id && parseInt(obj.status_id)),
											status: obj.status,
											cssBorderColor: obj.css_border_color,
											cssBGColor: obj.css_bg_color,
											cssColor: obj.css_color,
											client: obj.client,
											vehicleNo: obj.vehicle_no,
											createdOn: obj.created_on,
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

		$scope.viewRequestDetails = function(requestid) {
			var inputObj = {
				requestid: requestid
			};
			requestDetailsService.setInfo(inputObj);
			$state.go("home.requests.view.details");
		};

		$scope.updateRequestDetails = function(requestid) {
			var inputObj = {
				requestid: requestid
			};
			requestDetailsService.setInfo(inputObj);
			$state.go("home.requests.view.update");
		};

		$scope.canDeleteRequest = function() {
			var userInfo = userInfoService.getInfo();
			var ucategory = parseInt(userInfo.ucategory);

			return ([1, 2].indexOf(ucategory) !== -1);
		};

		$scope.deleteRequest = function(obj) {
			var msg = '';
			msg += '<div class="margin-bottom">Are you sure to delete <strong>' + obj.requestID + '</strong>?</div>';
			msg += '<div class="text-primary">';
				msg += '<small>';
					msg += '<span class="glyphicon glyphicon-info-sign"></span>';
					msg += '<em>All the storage items utilised in it will be reset back for re-use.</kbd>.</em>';
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
						label: "Delete Request",
						className: "btn-danger"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						deleteRequest(obj);
					}
				}
			});
		};

		function deleteRequest(obj) {
			$scope.msgObj = {};

			var url = $scope.basePath;
			url += "script.php?task=delete";
			var inputObj = {
				requestID: obj.id
			};

			restAPIFactory("DELETE", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.msgObj);
							$scope.msgObj.msg = "Deleted the request successfully.";
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.msgObj);
							$scope.msgObj.msg = "Error while deleting the request.";
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