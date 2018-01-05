(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("requestDetailsCtrl", requestDetailsCtrl);
	requestDetailsCtrl.$inject = [
		"$scope",
		"$state",
		"$filter",
		"userInfoService",
		"infoMessagesFactory",
		"alertInfoService",
		"restAPIFactory",
		"isArResFactory",
		"requestDetailsService"
	];

	function requestDetailsCtrl($scope, $state, $filter, userInfoService, infoMessagesFactory, alertInfoService, restAPIFactory, isArResFactory, requestDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			// $scope.reqDetailsRESTData = {};
			$scope.reqDetailsFormData = {};
			$scope.reqDetailsSbmtData = {};

			$scope.reqDetailsFormData.accordion = {};
			$scope.reqDetailsFormData.accordion.isClientDetails = true;
			$scope.reqDetailsFormData.accordion.isVehicleDetails = false;
			$scope.reqDetailsFormData.accordion.isRecDetails = true;
			$scope.reqDetailsFormData.accordion.isJobDetails = true;

			$scope.infoObj = {};
		}
		initObjs();
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

		function fetchRequestDetails() {
			$scope.infoObj = {};
			var alertInfo = alertInfoService.getInfo();
			if(alertInfo !== undefined) {
				if(Object.keys(alertInfo).length) {
					angular.copy(alertInfo, $scope.infoObj);
					alertInfoService.clearInfo();
				}
			}

			var requestDetails = requestDetailsService.getInfo();

			var url = $scope.basePath;
			url += "script.php?task=details";
			var inputObj = {
				requestid: requestDetails.requestid
			};

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					$scope.reqDetailsSbmtData = {};

					var obj = responseData.data[0];
					var reqDetailsSbmtData = {
						requestID: ((obj.id && parseInt(obj.id)) || 0),
						request: (obj.request_id || "-"),
						statusID: ((obj.status_id && parseInt(obj.status_id)) || 0),
						status: (obj.status || "-"),
						statusCSS: (obj.status_css || "-"),
						clientID: (obj.client_id || "-"),
						client: (obj.client || "-"),
						mobileNo: ((obj.mobile_no && parseInt(obj.mobile_no)) || 0),
						emailID: (obj.email_id || "-"),
						createdByID: ((obj.created_by_id && parseInt(obj.created_by_id)) || 0),
						receivedOn: (obj.created_on || "-"),
						assigneeID: ((obj.assignee_id && parseInt(obj.assignee_id)) || 0),
						assignee: (obj.assignee || "-"),
						approverID: ((obj.approver_id && parseInt(obj.approver_id)) || 0),
						approver: (obj.approver || "-"),
						vehicleID: ((obj.vehicle_id && parseInt(obj.vehicle_id)) || 0),
						vehicleType: (obj.vehicle_type || "-"),
						vehicleNo: (obj.vehicle_no || "-"),
						modelNo: (obj.model_no || "-"),
						chasisNo: (obj.chasis_no || "-"),
						engineNo: (obj.engine_no || "-"),
						manufacturedYear: ((obj.manufactured_year && parseInt(obj.manufactured_year)) || 0),
						odometerReading: ((obj.odometer_reading && parseInt(obj.odometer_reading)) || 0)
					};

					angular.copy(reqDetailsSbmtData, $scope.reqDetailsSbmtData);

					$scope.reqDetailsSbmtData.jobsAr = [];
					$scope.reqDetailsSbmtData.totalDuration = "-";
					$scope.reqDetailsSbmtData.grandTotal = 0;

					var requestDetails = requestDetailsService.getInfo();
					requestDetailsService.clearInfo();

					var url = $scope.basePath;
					url += "script.php?task=jobdetails";
					var inputObj = {
						requestid: requestDetails.requestid
					};

					restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
						if(jsonData.statusText === "OK") {
							$scope.jobDetailsManageLabelsAr = jsonData.data[0].jobDetailsManageLabelsAr;
							$scope.jobDetailsTHeadAr = jsonData.data[0].jobDetailsTHeadAr;

							restAPIFactory("POST", url, inputObj).post(function(jobData) {
								if(jobData.statusText === "OK") {
									if(isArResFactory(jobData)) {
										var responseAr = [];
										var grandTotal = 0;
										var totalDurationMS = 0;
										angular.forEach(jobData.data, function(obj) {
											var jobObj = {
												id: ((obj.id && parseInt(obj.id)) || 0),
												jobTypeID: ((obj.job_type_id && parseInt(obj.job_type_id)) || 0),
												jobType: (obj.job_type || "-"),
												clientRemark: (obj.client_remark || "-"),
												assigneeRemark: (obj.assignee_remark || "-"),
												itemID: ((obj.item_id && parseInt(obj.item_id)) || 0),
												item: (obj.item || "-"),
												itemPrice: ((obj.item_price && parseFloat(obj.item_price)) || 0),
												itemQuantity: ((obj.item_quantity && parseInt(obj.item_quantity)) || 0),
												itemDiscount: ((obj.item_discount && parseFloat(obj.item_discount)) || 0),
												itemTotal: ((obj.item_total && parseFloat(obj.item_total).toFixed(2)) || 0),
												serviceCharge: ((obj.service_charge && parseFloat(obj.service_charge)) || 0),
												vat: ((obj.vat && parseFloat(obj.vat)) || 0),
												total: ((obj.total && parseFloat(obj.total).toFixed(2)) || 0),
												startedOn: ((obj.started_on && ($filter("date")(obj.started_on, "dd-MM-yyyy hh:mm a"))) || "-"),
												endedOn: ((obj.ended_on && ($filter("date")(obj.ended_on, "dd-MM-yyyy hh:mm a"))) || "-")
											};

											jobObj.duration = "-";
											if(jobObj.startedOn && jobObj.endedOn) {
												var durationMS = getDurationMS(jobObj);

												if(durationMS > 0) {
													totalDurationMS += durationMS;
													jobObj.duration = $filter("msToHHMM")(durationMS);
												}
											}

											responseAr.push(jobObj);

											grandTotal += parseFloat(jobObj.total);
										});

										angular.copy(responseAr, $scope.reqDetailsSbmtData.jobsAr);

										if(totalDurationMS > 0) {
											$scope.reqDetailsSbmtData.totalDuration = $filter("msToHHMM")(totalDurationMS);
										}
										
										$scope.reqDetailsSbmtData.grandTotal = parseFloat(grandTotal).toFixed(2);
									}
								}
							});
						}
					});
				}
			});
		}
		fetchRequestDetails();

		function getDurationMS(inputObj) {
			var startedOnAr = inputObj.startedOn.split("-");
			var temp = startedOnAr[0];
			startedOnAr[0] = startedOnAr[1];
			startedOnAr[1] = temp;
			var startedOnMS = (new Date(startedOnAr.join("-"))).getTime();
			
			var endedOnAr = inputObj.endedOn.split("-");
			var temp = endedOnAr[0];
			endedOnAr[0] = endedOnAr[1];
			endedOnAr[1] = temp;
			var endedOnMS = (new Date(endedOnAr.join("-"))).getTime();
			
			var durationMS = (endedOnMS - startedOnMS);
			return durationMS;
		}

		$scope.editRequestDetails = function() {
			var inputObj = {
				requestid: $scope.reqDetailsSbmtData.requestID
			};
			requestDetailsService.setInfo(inputObj);
			$state.go("home.requests.view.update");
		};

		// Close the request >>
		$scope.canClose = function() {
			var userInfo = userInfoService.getInfo();
			var ucategory = parseInt(userInfo.ucategory);

			return ([1, 2].indexOf(ucategory) !== -1);
		};

		$scope.closeRequest = function() {
			var msg = "Are you sure?";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Close Request",
						className: "btn-success"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						closeRequest();
					}
				}
			});
		};

		function closeRequest() {
			$scope.infoObj = {};

			var url = $scope.basePath;
			url += "script.php?task=close";
			var inputObj = {
				requestID: parseInt($scope.reqDetailsSbmtData.requestID)
			};

			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("PUT", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.infoObj);
							$scope.infoObj.msg = "Closed the request successfully.";

							var inputObj = {
								requestid: $scope.reqDetailsSbmtData.requestID
							};
							requestDetailsService.setInfo(inputObj);

							fetchRequestDetails();
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.infoObj);
							$scope.infoObj.msg = "Error while closing the request.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.infoObj);
					$scope.infoObj.title += " (" + responseData.status + ")";
					$scope.infoObj.msg = responseData.statusText;
				}
			});
		};
		// <<

		// Reopen the request >>
		$scope.canReopen = function() {
			var userInfo = userInfoService.getInfo();
			var ucategory = parseInt(userInfo.ucategory);

			return ([1, 2].indexOf(ucategory) !== -1);
		};

		$scope.reopenRequest = function() {
			var msg = '';
			msg += '<div class="margin-bottom">Are you sure?</div>';
			msg += '<div class="text-primary">';
				msg += '<small>';
					msg += '<span class="glyphicon glyphicon-info-sign"></span>';
					msg += '<em>The request status will be moved to <strong>InProgress</strong>.</em>';
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
						label: "Reopen Request",
						className: "btn-warning"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						reopenRequest();
					}
				}
			});
		};

		function reopenRequest() {
			$scope.infoObj = {};

			var url = $scope.basePath;
			url += "script.php?task=reopen";
			var inputObj = {
				requestID: parseInt($scope.reqDetailsSbmtData.requestID)
			};

			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("PUT", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.infoObj);
							$scope.infoObj.msg = "Reopened the request successfully.";

							var inputObj = {
								requestid: $scope.reqDetailsSbmtData.requestID
							};
							requestDetailsService.setInfo(inputObj);

							fetchRequestDetails();
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.infoObj);
							$scope.infoObj.msg = "Error while reopening the request.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.infoObj);
					$scope.infoObj.title += " (" + responseData.status + ")";
					$scope.infoObj.msg = responseData.statusText;
				}
			});
		};
		// <<

		$scope.printRequest = function() {
			var tpl = document.getElementById("home_servicereq_details_container_print").innerHTML;;
			var popUp = window.open("", "_blank", "fullscreen=yes, height=700, scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no");
			popUp.document.open();

			var pdfTpl = '';
			pdfTpl += '<html>';
				pdfTpl += '<head>';
					pdfTpl += '<title>eGarage_Invoice_' + $scope.reqDetailsSbmtData.request + '</title>';
					pdfTpl += '<link href="assets/css/lib/bootstrap.min.css" rel="stylesheet" />';
					pdfTpl += '<link rel="stylesheet" type="text/css" href="assets/css/custom/style.css" />';
				pdfTpl += '</head>';
				pdfTpl += '<body onload="window.print()">' + tpl + '</body>';
			pdfTpl += '</html>';

			popUp.document.write(pdfTpl);
			popUp.document.close();
		};
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
		$scope.refresh = function() {
			var inputObj = {
				requestid: $scope.reqDetailsSbmtData.requestID
			};
			requestDetailsService.setInfo(inputObj);
			$state.go($state.current, {}, { reload: true });
		};
		// <<=
	}
})();