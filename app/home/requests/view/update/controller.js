(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("requestUpdateDetailsCtrl", requestUpdateDetailsCtrl);
	requestUpdateDetailsCtrl.$inject = [
		"$scope",
		"$state",
		"$filter",
		"$sce",
		"dpConfFactory",
		"userInfoService",
		"infoMessagesFactory",
		"alertInfoService",
		"restAPIFactory",
		"isArResFactory",
		"requestDetailsService"
	];

	function requestUpdateDetailsCtrl($scope, $state, $filter, $sce, dpConfFactory, userInfoService, infoMessagesFactory, alertInfoService, restAPIFactory, isArResFactory, requestDetailsService) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.reqUpdateRESTData = {};
			$scope.reqUpdateFormData = {};
			$scope.reqUpdateSbmtData = {};

			$scope.reqUpdateRESTData.superadminsAr = [];
			$scope.reqUpdateRESTData.adminsAr = [];
			$scope.reqUpdateRESTData.employeesAr = [];

			$scope.reqUpdateRESTData.assigneesAr = [];
			$scope.reqUpdateRESTData.approversAr = [];

			$scope.reqUpdateRESTData.jobTypesAr = [];
			$scope.reqUpdateRESTData.storageItemDetailsAr = [];
			$scope.reqUpdateRESTData.storageItemsAr = [];

			$scope.reqUpdateFormData.isManage = false;
			$scope.reqUpdateFormData.isSummary = true;

			$scope.reqUpdateSbmtData.jobsAr = [];

			dpConfFactory.format = "DD-MM-YYYY hh:mm A";
			$scope.dateTimePickerConf = JSON.stringify(dpConfFactory);

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
					angular.copy(responseAr, $scope.reqUpdateRESTData.superadminsAr);
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
					angular.copy(responseAr, $scope.reqUpdateRESTData.adminsAr);
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
					angular.copy(responseAr, $scope.reqUpdateRESTData.employeesAr);
					// <<

					var superadminsAr = $scope.reqUpdateRESTData.superadminsAr;
					var adminsAr = $scope.reqUpdateRESTData.adminsAr;
					var employeesAr = $scope.reqUpdateRESTData.employeesAr;

					$scope.reqUpdateRESTData.assigneesAr = [].concat(superadminsAr, adminsAr, employeesAr);
					$scope.reqUpdateRESTData.approversAr = [].concat(superadminsAr, adminsAr, employeesAr);
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
					angular.copy(responseAr, $scope.reqUpdateRESTData.jobTypesAr);
				}
			}
		});

		function getStorageItems() {
			var requestDetails = requestDetailsService.getInfo();

			var url = $scope.basePath;
			url += "script.php?task=storageitems";
			var inputObj = {
				requestid: parseInt(requestDetails.requestid)
			};

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					if(isArResFactory(responseData)) {
						var responseAr = [];
						angular.forEach(responseData.data, function(obj) {
							responseAr.push({
								itemCatID: parseInt(obj.item_cat_id),
								itemCatCode: obj.item_cat_code,
								itemCatName: obj.item_cat_name,
								itemID: parseInt(obj.item_id),
								itemCode: obj.item_code,
								item: obj.item,
								invoice: obj.invoice,
								price: ((obj.price && $filter("toDecimal")(obj.price)) || 0),
								itemQuantityID: parseInt(obj.item_quantity_id),
								quantityCount: parseInt(obj.quantity_count)
							});
						});

						angular.copy(getStorageItemsAr(responseAr), $scope.reqUpdateRESTData.storageItemsAr);
						angular.copy(responseAr, $scope.reqUpdateRESTData.storageItemDetailsAr);

						fetchRequestDetails();
					}
				}
			});
		}
		getStorageItems();

		function getStorageItemsAr(inputAr) {
			var storageItemsAr = [];
			angular.forEach(inputAr, function(obj) {
				if(!$scope.filterData(storageItemsAr, "id", obj.itemID).length) {
					storageItemsAr.push({
						catID: obj.itemCatID,
						catCode: obj.itemCatCode,
						cat: obj.itemCatName,
						id: obj.itemID,
						code: obj.itemCode,
						name: obj.item,
						isItemQuantity: true
					});
				}
			});

			return storageItemsAr;
		}
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

		$scope.removeRow = function(ind) {
			var msg = "Are you sure? The entered data for the row will be lost.";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Remove Row",
						className: "btn-warning"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						$scope.reqUpdateSbmtData.jobsAr.splice(ind, 1);
						$scope.refreshStorageItems();
					}
				}
			});
		};

		$scope.addRow = function() {
			var obj = {
				jobID: 0,
				jobTypeID: 0,
				jobType: "",
				isAddJob: false,
				clientRemark: "",
				assigneeRemark: "",
				storageItemsAr: [],
				itemID: 0,
				item: "",
				itemPrice: 0,
				itemQuantity: 0,
				itemMaxQuantity: 0,
				itemQuantityDetails: [],
				itemDiscount: 0,
				itemTotal: 0,
				serviceCharge: 0,
				vat: 0,
				total: 0,
				startedOn: "",
				endedOn: ""
			};

			$scope.reqUpdateSbmtData.jobsAr.push(obj);
		};

		function fetchRequestDetails() {
			restAPIFactory("GET", "assets/js/custom/model.json", {}).post(function(jsonData) {
				if(jsonData.statusText === "OK") {
					$scope.jobDetailsManageLabelsAr = jsonData.data[0].jobDetailsManageLabelsAr;
					$scope.jobDetailsSummaryTHeadAr = jsonData.data[0].jobDetailsSummaryTHeadAr;

					var requestDetails = requestDetailsService.getInfo();

					var url = $scope.basePath;
					url += "script.php?task=details";
					var inputObj = {
						requestid: parseInt(requestDetails.requestid)
					};

					restAPIFactory("POST", url, inputObj).post(function(responseData) {
						if(responseData.statusText === "OK") {
							$scope.reqUpdateSbmtData = {};

							var obj = responseData.data[0];
							var reqUpdateSbmtData = {
								requestID: ((obj.id && parseInt(obj.id)) || 0),
								request: (obj.request_id || "-"),
								statusID: ((obj.status_id && parseInt(obj.status_id)) || 0),
								status: (obj.status || "-"),
								statusCSS: (obj.status_css || "-"),
								clientID: ((obj.client_id && parseInt(obj.client_id)) || 0),
								client: (obj.client || "-"),
								createdByID: ((obj.created_by_id && parseInt(obj.created_by_id)) || 0),
								createdBy: (obj.created_by || "-"),
								receivedOn: (obj.created_on || "-"),
								assigneeID: ((obj.assignee_id && parseInt(obj.assignee_id)) || 0),
								assignee: (obj.assignee || "-"),
								approverID: ((obj.approver_id && parseInt(obj.approver_id)) || 0),
								approver: (obj.approver || "-"),
								vehicleID: ((obj.vehicle_id && parseInt(obj.vehicle_id)) || 0),
								vehicleType: (obj.vehicle_type || "-"),
								vehicleNo: (obj.vehicle_no || "-")
							};

							angular.copy(reqUpdateSbmtData, $scope.reqUpdateSbmtData);

							$scope.reqUpdateSbmtData.jobsAr = [];

							var requestDetails = requestDetailsService.getInfo();
							requestDetailsService.clearInfo();

							var url = $scope.basePath;
							url += "script.php?task=jobdetails";
							var inputObj = {
								requestid: parseInt(requestDetails.requestid)
							};

							restAPIFactory("POST", url, inputObj).post(function(jobData) {
								if(jobData.statusText === "OK") {
									if(isArResFactory(jobData)) {
										var responseAr = [];

										var maxQuantityObj = {};
										angular.forEach(jobData.data, function(obj) {
											obj.item_id = ((obj.item_id && parseInt(obj.item_id)) || 0);

											if(obj.item_id) {
												((maxQuantityObj[obj.item_id] === undefined) && (maxQuantityObj[obj.item_id] = {}));
												((!maxQuantityObj[obj.item_id].counter) && (maxQuantityObj[obj.item_id].counter = 0));

												maxQuantityObj[obj.item_id].val = ($scope.filterData($scope.reqUpdateRESTData.storageItemDetailsAr, "itemID", obj.item_id).length - maxQuantityObj[obj.item_id].counter);

												var storageItemsAr = [];
												angular.copy($scope.reqUpdateRESTData.storageItemsAr, storageItemsAr);

												$scope.filterData(storageItemsAr, "id", obj.item_id)[0].isItemQuantity = (maxQuantityObj[obj.item_id].val > 0);

												maxQuantityObj[obj.item_id].counter += ((obj.item_quantity && parseInt(obj.item_quantity)) || 0);
											} else {
												var storageItemsAr = [];
												angular.copy($scope.reqUpdateRESTData.storageItemsAr, storageItemsAr);

												angular.forEach(storageItemsAr, function(subObj) {
													var itemMaxQuantity = $scope.filterData($scope.reqUpdateRESTData.storageItemDetailsAr, "itemID", subObj.id).length;

													var counter = 0;
													angular.forEach($scope.filterData(jobData.data, "item_id", subObj.id), function(superSubObj) {
														counter += ((superSubObj.item_quantity && parseInt(superSubObj.item_quantity)) || 0);
													});

													subObj.isItemQuantity = (counter < itemMaxQuantity);
												});
											}

											var jobObj = {
												jobID: ((obj.id && parseInt(obj.id)) || 0),
												jobTypeID: ((obj.job_type_id && parseInt(obj.job_type_id)) || 0),
												jobType: (obj.job_type || ""),
												isAddJob: false,
												clientRemark: (obj.client_remark || ""),
												assigneeRemark: (obj.assignee_remark || ""),
												storageItemsAr: storageItemsAr,
												itemID: ((obj.item_id && parseInt(obj.item_id)) || 0),
												item: (obj.item || ""),
												itemPrice: ((obj.item_price && parseFloat(obj.item_price)) || 0),
												itemQuantity: ((obj.item_quantity && parseInt(obj.item_quantity)) || 0),
												itemMaxQuantity: ((obj.item_id && maxQuantityObj[obj.item_id].val) || 0),
												itemDiscount: ((obj.item_discount && parseFloat(obj.item_discount)) || 0),
												itemTotal: ((obj.item_total && parseFloat(obj.item_total)) || 0),
												serviceCharge: ((obj.service_charge && parseFloat(obj.service_charge)) || 0),
												vat: ((obj.vat && parseFloat(obj.vat)) || 0),
												total: ((obj.total && parseFloat(obj.total)) || 0)
											};

											jobObj.startedOn = "";
											if(obj.started_on) {
												jobObj.startedOn = $filter("date")(obj.started_on, "dd-MM-yyyy hh:mm a");
											}

											jobObj.endedOn = "";
											if(obj.ended_on) {
												jobObj.endedOn = $filter("date")(obj.ended_on, "dd-MM-yyyy hh:mm a");
											}

											jobObj.itemQuantityDetails = [];
											if(obj.item_quantity_details) {
												jobObj.itemQuantityDetails = obj.item_quantity_details.split(",").map(function(id) {
													return parseInt(id);
												});
											}

											responseAr.push(jobObj);
										});
										angular.copy(responseAr, $scope.reqUpdateSbmtData.jobsAr);
									}
									// end if
								}
								// end if
							});
							// end restAPIFactory
						}
						// end if
					});
					// end restAPIFactory
				}
				// end if
			});
			// end restAPIFactory
		}

		$scope.refreshStorageItems = function() {
			var maxQuantityObj = {};
			angular.forEach($scope.reqUpdateSbmtData.jobsAr, function(obj) {
				obj.itemID = ((obj.itemID && parseInt(obj.itemID)) || 0);

				if(obj.itemID) {
					((maxQuantityObj[obj.itemID] === undefined) && (maxQuantityObj[obj.itemID] = {}));
					((!maxQuantityObj[obj.itemID].counter) && (maxQuantityObj[obj.itemID].counter = 0));

					var storageItemDetailsAr = [];
					angular.copy($scope.filterData($scope.reqUpdateRESTData.storageItemDetailsAr, "itemID", obj.itemID), storageItemDetailsAr);
					maxQuantityObj[obj.itemID].val = (storageItemDetailsAr.length - maxQuantityObj[obj.itemID].counter);

					var storageItemsAr = [];
					angular.copy($scope.reqUpdateRESTData.storageItemsAr, storageItemsAr);

					$scope.filterData(storageItemsAr, "id", obj.itemID)[0].isItemQuantity = (maxQuantityObj[obj.itemID].val > 0);
					if(!(maxQuantityObj[obj.itemID].val > 0)) {
						obj.itemQuantity = 0;
						obj.itemDiscount = 0;
						obj.serviceCharge = 0;
					}

					obj.storageItemsAr = [];
					angular.copy(storageItemsAr, obj.storageItemsAr);

					obj.itemMaxQuantity = maxQuantityObj[obj.itemID].val;

					obj.itemQuantityDetails = [];
					angular.forEach(storageItemDetailsAr, function(subObj, ind) {
						var counter = maxQuantityObj[subObj.itemID].counter;
						if((counter <= ind) && (ind < (counter + obj.itemQuantity))) {
							obj.itemQuantityDetails.push(subObj.itemQuantityID);
						}
					});

					maxQuantityObj[obj.itemID].counter += ((obj.itemQuantity && parseInt(obj.itemQuantity)) || 0);
				} else {
					var storageItemsAr = [];
					angular.copy($scope.reqUpdateRESTData.storageItemsAr, storageItemsAr);

					angular.forEach(storageItemsAr, function(subObj) {
						var itemMaxQuantity = $scope.filterData($scope.reqUpdateRESTData.storageItemDetailsAr, "itemID", subObj.id).length;

						var counter = 0;
						angular.forEach($scope.filterData($scope.reqUpdateSbmtData.jobsAr, "itemID", subObj.id), function(superSubObj) {
							counter += ((superSubObj.itemQuantity && parseInt(superSubObj.itemQuantity)) || 0);
						});

						subObj.isItemQuantity = (counter < itemMaxQuantity);
					});

					obj.storageItemsAr = [];
					angular.copy(storageItemsAr, obj.storageItemsAr);
				}
			});
		};

		$scope.getItemPrice = function(job) {
			var sum = 0;
			if(job.itemID) {
				job.itemQuantityDetails.forEach(function(itemQuantityID) {
					var price = $scope.filterData($scope.reqUpdateRESTData.storageItemDetailsAr, "itemQuantityID", itemQuantityID)[0].price;
					sum += price;
				});

				sum /= job.itemQuantity;
			}

			sum = $filter("toDecimal", 2)(sum);
			job.itemPrice = ((!isNaN(sum) && sum) || 0);
			return job.itemPrice;
		};

		$scope.getItemPriceDetails = function(job) {
			var tplAr = [];
			// var tpl = '';
			// tpl += '<ul>';
			if(job.itemID) {
				job.itemQuantityDetails.forEach(function(itemQuantityID, ind) {
					var itemQuantityIDObj = $scope.filterData($scope.reqUpdateRESTData.storageItemDetailsAr, "itemQuantityID", itemQuantityID)[0];
					// tpl += '<li>';
						// tpl += ('Unit ' + (ind + 1) + ': ' + itemQuantityIDObj.price);
					// tpl += '</li>';

					tplAr.push("Unit " + (ind + 1) + ": " + itemQuantityIDObj.price);
				});
			}
			// tpl += '</ul>';

			return tplAr.join("; ");
		};

		$scope.getItemTotal = function(job) {
			var itemTotal = (parseFloat(job.itemPrice) * job.itemQuantity);
			job.itemTotal = (itemTotal - (itemTotal * (job.itemDiscount * 0.01)));

			job.itemTotal = $filter("toDecimal", 2)(job.itemTotal);
			job.itemTotal = ((!isNaN(job.itemTotal) && job.itemTotal) || 0);
			return job.itemTotal;
		};

		$scope.getTotal = function(job) {
			job.total = (parseFloat(job.itemTotal) + job.serviceCharge);
			job.total += (job.total * (job.vat * 0.01));

			job.total = $filter("toDecimal", 2)(job.total);
			job.total = ((!isNaN(job.total) && job.total) || 0);
			return job.total;
		};

		$scope.getGrandTotal = function() {
			var grandTotal = 0;
			if($scope.reqUpdateSbmtData.jobsAr.length) {
				angular.forEach($scope.reqUpdateSbmtData.jobsAr, function(obj) {
					grandTotal += parseFloat(obj.total);
				});
			}

			grandTotal = $filter("toDecimal", 2)(grandTotal);
			return ((!isNaN(grandTotal) && grandTotal) || 0);
		};

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

		$scope.getDuration = function(job) {
			var duration = "-";
			if(job.startedOn && job.endedOn) {
				var durationMS = getDurationMS(job);

				if(durationMS > 0) {
					duration = $filter("msToHHMM")(durationMS);
				}
			}

			return duration;
		};

		$scope.getTotalDuration = function() {
			var totalDuration = "-";

			if($scope.reqUpdateSbmtData.jobsAr.length) {
				var totalDurationMS = 0;
				angular.forEach($scope.reqUpdateSbmtData.jobsAr, function(obj) {
					if(obj.startedOn && obj.endedOn) {
						var durationMS = getDurationMS(obj);

						if(durationMS > 0) {
							totalDurationMS += durationMS;
						}
					}
				});

				if(totalDurationMS > 0) {
					totalDuration = $filter("msToHHMM")(totalDurationMS);
				}
			}

			return totalDuration;
		};

		$scope.updateRequestDetails = function() {
			var msg = "Are you sure?";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Update Request",
						className: "btn-primary"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						updateRequestDetails();
					}
				}
			});
		};

		function updateRequestDetails() {
			$scope.infoObj = {};

			var url = $scope.basePath;
			url += "script.php?task=update";

			var reqUpdateSbmtData = {};
			angular.copy($scope.reqUpdateSbmtData, reqUpdateSbmtData);

			var inputObj = {};
			inputObj.requestID = (reqUpdateSbmtData.requestID || 0);
			inputObj.assigneeID = (reqUpdateSbmtData.assigneeID || 0);
			inputObj.approverID = (reqUpdateSbmtData.approverID || 0);

			var jobsAr = [];
			angular.forEach(reqUpdateSbmtData.jobsAr, function(obj) {
				var jobObj = {
					jobID: ((obj.jobID && parseInt(obj.jobID)) || 0),
					jobTypeID: ((obj.jobTypeID && parseInt(obj.jobTypeID)) || 0),
					jobType: (obj.jobType || ""),
					isAddJob: obj.isAddJob,
					clientRemark: (obj.clientRemark || ""),
					assigneeRemark: (obj.assigneeRemark || ""),
					itemID: ((obj.itemID && parseInt(obj.itemID)) || 0),
					itemQuantity: ((obj.itemQuantity && parseInt(obj.itemQuantity)) || 0),
					itemQuantityDetails: ((obj.itemQuantityDetails && obj.itemQuantityDetails.join(",")) || ""),
					itemPrice: ((obj.itemPrice && parseFloat(obj.itemPrice)) || 0),
					itemDiscount: ((obj.itemDiscount && parseFloat(obj.itemDiscount)) || 0),
					vat: ((obj.vat && parseFloat(obj.vat)) || 0),
					itemTotal: ((obj.itemTotal && parseFloat(obj.itemTotal)) || 0),
					serviceCharge: ((obj.serviceCharge && parseFloat(obj.serviceCharge)) || 0),
					total: ((obj.total && parseFloat(obj.total)) || 0)
				};

				jobObj.startedOn = "";
				if(obj.startedOn) {
					jobObj.startedOn = $filter("formatDateYMDHHMMA")(obj.startedOn);
				}

				jobObj.endedOn = "";
				if(obj.endedOn) {
					jobObj.endedOn = $filter("formatDateYMDHHMMA")(obj.endedOn);
				}

				jobsAr.push(jobObj);
			});

			inputObj.jobsAr = [];
			angular.copy(jobsAr, inputObj.jobsAr);

			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					var resObj = responseData.data;
					switch(resObj.status) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.infoObj);
							$scope.infoObj.msg = "Updated the request successfully.";

							var inputObj = {
								requestid: resObj.response
							};
							requestDetailsService.setInfo(inputObj);
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.infoObj);
							$scope.infoObj.msg = "Error while updating the request.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.infoObj);
					$scope.infoObj.title += (" (" + responseData.status + ")");
					$scope.infoObj.msg = responseData.statusText;
				}

				alertInfoService.setInfo($scope.infoObj);
				$state.go("home.requests.view.details");
			});
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
				requestID: parseInt($scope.reqUpdateSbmtData.requestID)
			};

			var userInfo = userInfoService.getInfo();
			inputObj.myid = userInfo.uid;

			restAPIFactory("PUT", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.infoObj);
							$scope.infoObj.msg = "Closed the request successfully.";
							alertInfoService.setInfo($scope.infoObj);

							var inputObj = {
								requestid: $scope.reqUpdateSbmtData.requestID
							};
							requestDetailsService.setInfo(inputObj);
							$state.go("home.requests.view.details");
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
		// <<=

		// Refresh/Rest of the page =>>
		// ============================
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
						var inputObj = {
							requestid: $scope.reqUpdateSbmtData.requestID
						};
						requestDetailsService.setInfo(inputObj);

						fetchRequestDetails();
					}
				}
			});
		};
		// <<=
	}
})();