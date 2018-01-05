(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("requestCreateCtrl", requestCreateCtrl);
	requestCreateCtrl.$inject = [
		"$scope",
		"$state",
		"$filter",
		"dpConfFactory",
		"userInfoService",
		"infoMessagesFactory",
		"alertInfoService",
		"restAPIFactory",
		"isArResFactory",
		"requestDetailsService"
	];

	function requestCreateCtrl($scope, $state, $filter, dpConfFactory, userInfoService, infoMessagesFactory, alertInfoService, restAPIFactory, isArResFactory, requestDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.reqCreateRESTData = {};
			$scope.reqCreateFormData = {};
			$scope.reqCreateSbmtData = {};

			$scope.reqCreateRESTData.superadminsAr = [];
			$scope.reqCreateRESTData.adminsAr = [];
			$scope.reqCreateRESTData.employeesAr = [];

			$scope.reqCreateFormData.accordion = {};
			$scope.reqCreateFormData.accordion.isClientDetails = false;
			$scope.reqCreateFormData.accordion.isVehicleDetails = false;
			$scope.reqCreateFormData.accordion.isRecDetails = false;
			$scope.reqCreateFormData.accordion.isJobDetails = false;
			$scope.reqCreateFormData.accordion.isSummary = false;

			// Client Details >>
			$scope.reqCreateFormData.clientDetails = {};
			$scope.reqCreateFormData.clientDetails.activetr = null;
			$scope.reqCreateFormData.clientDetails.isCreate = false;

			$scope.reqCreateSbmtData.clientDetails = {};
			// <<

			// Vehicle Details >>
			$scope.reqCreateSbmtData.vehicleDetails = {};
			// <<

			// Receiving Details >>
			$scope.reqCreateRESTData.recDetails = {};
			// $scope.reqCreateRESTData.recDetails.receiversAr = [];
			$scope.reqCreateRESTData.recDetails.assigneesAr = [];
			$scope.reqCreateRESTData.recDetails.approversAr = [];

			$scope.reqCreateSbmtData.recDetails = {};
			// <<

			// Job Details >>
			$scope.reqCreateRESTData.jobDetails = {};
			$scope.reqCreateRESTData.jobDetails.jobTypesAr = [];

			$scope.reqCreateSbmtData.jobDetails = {};
			$scope.reqCreateSbmtData.jobDetails.jobsAr = [];
			$scope.reqCreateSbmtData.jobDetails.jobsAr.push({
				job: "",
				isAddJob: false,
				jobName: "",
				remark: ""
			});
			// <<

			dpConfFactory.format = "DD-MM-YYYY hh:mm A";
			$scope.datetimepickerOptions = JSON.stringify(dpConfFactory);

			$scope.clientDetTBodyAr = [];

			$scope.clientDetInfoObj = {};
			$scope.clientDetInfoObj.msg = "Please apply the filter.";

			$scope.infoObj = {};
		}
		initObjs();
		// <<=

		// Rest calls for the page =>>
		// ===========================
		var url = $scope.basePath;
		url += "script.php?task=users";
		restAPIFactory("GET", url, {}).post(function(responseData) {
			if(responseData.statusText === "OK") {
				if(isArResFactory(responseData)) {
					// Superadmins >>
					var responseAr = [];
					angular.forEach(responseData.data[0], function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							name: obj.name,
							ucategory: obj.ucategory
						});
					});
					angular.copy(responseAr, $scope.reqCreateRESTData.superadminsAr);
					// <<

					// Admins >>
					var responseAr = [];
					angular.forEach(responseData.data[1], function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							name: obj.name,
							ucategory: obj.ucategory
						});
					});
					angular.copy(responseAr, $scope.reqCreateRESTData.adminsAr);
					// <<

					// Employees >>
					var responseAr = [];
					angular.forEach(responseData.data[2], function(obj) {
						responseAr.push({
							id: parseInt(obj.id),
							name: obj.name,
							ucategory: obj.ucategory
						});
					});
					angular.copy(responseAr, $scope.reqCreateRESTData.employeesAr);
					// <<

					var superadminsAr = $scope.reqCreateRESTData.superadminsAr;
					var adminsAr = $scope.reqCreateRESTData.adminsAr;
					var employeesAr = $scope.reqCreateRESTData.employeesAr;

					// $scope.reqCreateRESTData.recDetails.receiversAr = [].concat(superadminsAr, adminsAr, employeesAr);
					$scope.reqCreateRESTData.recDetails.assigneesAr = [].concat(superadminsAr, adminsAr, employeesAr);
					$scope.reqCreateRESTData.recDetails.approversAr = [].concat(superadminsAr, adminsAr, employeesAr);
				}
			}
		});

		var url = $scope.basePath;
		url += "script.php?task=jobtypes";
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
					angular.copy(responseAr, $scope.reqCreateRESTData.jobDetails.jobTypesAr);
				}
			}
		});
		// <<=

		// Behaviours of the page =>>
		// ==========================
		// Automated methods >>
		$scope.filterData = function(inputAr, inputKey, inputVal) {
			if(inputAr !== undefined) {
				return inputAr.filter(function(obj) {
					return (obj[inputKey] === inputVal);
				});
			} else {
				return [];
			}
		};
		// <<

		$scope.isSearchClient = function() {
			return !($scope.reqCreateSbmtData.clientDetails.requestIDModel || $scope.reqCreateSbmtData.clientDetails.nameModel || $scope.reqCreateSbmtData.clientDetails.mobileNoModel || $scope.reqCreateSbmtData.clientDetails.emailIDModel);
		}

		$scope.searchClient = function() {
			$scope.clientDetTBodyAr = [];
			$scope.clientDetInfoObj.msg = "Please wait...";
			restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
				if(jsonData.statusText === "OK") {
					$scope.theadAr = jsonData.data[0].clientsDetTHeadAr;

					var url = $scope.basePath;
					url += "script.php?task=clients";

					var inputObj = {};
					inputObj.requestIDModel = ($scope.reqCreateSbmtData.clientDetails.requestIDModel || "");
					inputObj.nameModel = ($scope.reqCreateSbmtData.clientDetails.nameModel || "");
					inputObj.mobileNoModel = ($scope.reqCreateSbmtData.clientDetails.mobileNoModel || "");
					inputObj.emailIDModel = ($scope.reqCreateSbmtData.clientDetails.emailIDModel || "");

					if(!Object.keys(inputObj).filter(function(key){ return ("" + inputObj[key]); }).length) {
						$scope.infoObj.msg = "Please apply the filter.";
					} else {
						restAPIFactory("POST", url, inputObj).post(function(responseData) {
							if(responseData.statusText === "OK") {
								if(isArResFactory(responseData)) {
									$scope.clientDetInfoObj.msg = "";

									var responseAr = [];
									angular.forEach(responseData.data, function(obj) {
										responseAr.push({
											id: (obj.id && parseInt(obj.id)),
											username: obj.username,
											name: obj.name,
											mobileNo: (obj.mobile_no && parseInt(obj.mobile_no)),
											emailID: obj.email_id,
											createdOn: obj.created_on
										});
									});
									angular.copy(responseAr, $scope.clientDetTBodyAr);

									$scope.orderBy = "createdOn";
									$scope.orderByDir = true;
									$scope.sortColumn = function(code) {
										$scope.orderBy = code;
										$scope.orderByDir = !$scope.orderByDir;
									};
								} else {
									$scope.clientDetInfoObj.msg = "No records found.";
								}
							} else {
								$scope.clientDetInfoObj.msg = "Something went wrong.";
							}
						});
					}
				} else {
					$scope.clientDetInfoObj.msg = "Something went wrong.";
				}
			});
		};

		$scope.userCreateSubmit = function() {
			var msg = "Are you sure?";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Create",
						className: "btn-primary"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						userCreateSubmit();
					}
				}
			});
		};

		function userCreateSubmit() {
			$scope.infoObj = {};

			var url = $scope.basePath;
			url += "script.php?task=create";

			var reqCreateSbmtData = {};
			angular.copy($scope.reqCreateSbmtData, reqCreateSbmtData);

			var inputObj = {};
			// Client Details >>
			inputObj.clientIDModel = (reqCreateSbmtData.clientDetails.clientIDModel || 0);
			inputObj.firstNameModel = (reqCreateSbmtData.clientDetails.firstNameModel || "");
			inputObj.lastNameModel = (reqCreateSbmtData.clientDetails.lastNameModel || "");
			inputObj.mobileNoModel = (reqCreateSbmtData.clientDetails.mobileNoModel || 0);
			inputObj.emailIDModel = (reqCreateSbmtData.clientDetails.emailIDModel || "");
			// <<

			// Vehicle Details >>
			inputObj.vehicleTypeModel = (reqCreateSbmtData.vehicleDetails.vehicleTypeModel || "");
			inputObj.vehicleNoModel = (reqCreateSbmtData.vehicleDetails.vehicleNoModel || "");
			inputObj.modelNoModel = (reqCreateSbmtData.vehicleDetails.modelNoModel || "");
			inputObj.chasisNoModel = (reqCreateSbmtData.vehicleDetails.chasisNoModel || "");
			inputObj.engineNoModel = (reqCreateSbmtData.vehicleDetails.engineNoModel || "");
			inputObj.manufacturedYearModel = (reqCreateSbmtData.vehicleDetails.manufacturedYearModel || 0);
			inputObj.odometerReadingModel = (reqCreateSbmtData.vehicleDetails.odometerReadingModel || 0);
			// <<

			// Receiving Details >>
			inputObj.receivingOnModel = "";
			if(reqCreateSbmtData.recDetails.receivingOnModel) {
				inputObj.receivingOnModel = $filter("formatDateYMDHHMMA")(reqCreateSbmtData.recDetails.receivingOnModel);
			}
			// inputObj.receivingByModel = (reqCreateSbmtData.recDetails.receivingByModel || 0);
			inputObj.assigneeModel = (reqCreateSbmtData.recDetails.assigneeModel || 0);
			inputObj.approverModel = (reqCreateSbmtData.recDetails.approverModel || 0);
			// <<

			// Job Details >>
			inputObj.jobsAr = [];
			angular.copy(reqCreateSbmtData.jobDetails.jobsAr, inputObj.jobsAr);
			// <<

			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					var resObj = responseData.data;
					switch(resObj.status) {
						case "ALREADY_EXISTS":
							angular.copy(infoMessagesFactory.info, $scope.infoObj);
							$scope.infoObj.msg = "The client already exists.";
						break;

						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.infoObj);
							$scope.infoObj.msg = "Created the request successfully.";
							alertInfoService.setInfo($scope.infoObj);

							var inputObj = {
								requestid: resObj.response
							};
							requestDetailsService.setInfo(inputObj);
							$state.go("home.requests.view.details");
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.infoObj);
							$scope.infoObj.msg = "Error while creating the request.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.infoObj);
					$scope.infoObj.title += " (" + responseData.status + ")";
					$scope.infoObj.msg = responseData.statusText;
				}
			});
		};

		$scope.formName = function() {
			var namesAr = [];

			var firstNameModel = $scope.reqCreateSbmtData.clientDetails.firstNameModel;
			var lastNameModel = $scope.reqCreateSbmtData.clientDetails.lastNameModel;

			(firstNameModel && namesAr.push(firstNameModel.trim()));
			(lastNameModel && namesAr.push(lastNameModel.trim()));

			$scope.reqCreateSbmtData.clientDetails.name = namesAr.join(" ");
		}
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		$scope.resetForm = function(type) {
			switch(type) {
				case "clientdetails":
					$scope.clientDetailsForm.$setPristine();

					$scope.reqCreateFormData.clientDetails.isCreate = !$scope.reqCreateFormData.clientDetails.isCreate;
					$scope.reqCreateFormData.clientDetails.activetr = null;

					$scope.reqCreateSbmtData.clientDetails = {};

					$scope.clientDetTBodyAr = [];

					$scope.clientDetInfoObj = {};
					$scope.clientDetInfoObj.msg = "Please apply the filter.";
				break;
			}
		};

		$scope.reset = function() {
			var msg = "Are you sure?";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Reset",
						className: "btn-warning"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						$state.go($state.current, {}, { reload: true });
					}
				}
			});
		};
		// <<=
	}
})();