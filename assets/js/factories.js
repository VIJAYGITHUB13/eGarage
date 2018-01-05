(function() {
	"use strict";

	var eGarageAppFactories = angular.module("eGarageAppFactories", []);
	
	eGarageAppFactories.factory("infoMessagesFactory", function() {
		return {
			success: {
				name: "success",
				alertName: "alert-success",
				title: "Success",
				msg: ""
			},
			info: {
				name: "info",
				alertName: "alert-info",
				title: "Info",
				msg: ""
			},
			warning: {
				name: "warning",
				alertName: "alert-warning",
				title: "Warning",
				msg: ""
			},
			danger: {
				name: "danger",
				alertName: "alert-danger",
				title: "Error",
				msg: ""
			}
		};
	});
	
	eGarageAppFactories.factory("alertMessagesFactory", function() {
		return {
			success: {
				alertName: "alert-success",
				title: "Success",
				msg: "",
				borderColor: "rgba(60, 118, 61, 0.25)",
				glyphicon: "glyphicon-ok-circle"
			},
			info: {
				alertName: "alert-info",
				title: "Info",
				msg: "",
				borderColor: "rgba(49, 112, 143, 0.25)",
				glyphicon: "glyphicon-info-sign"
			},
			warning: {
				alertName: "alert-warning",
				title: "Warning",
				msg: "",
				borderColor: "rgba(138, 109, 59, 0.25)",
				glyphicon: "glyphicon-warning-sign"
			},
			danger: {
				alertName: "alert-danger",
				title: "Error",
				msg: "",
				borderColor: "rgba(169, 68, 66, 0.25)",
				glyphicon: "glyphicon-remove-circle"
			}
		};
	});

	eGarageAppFactories.factory("paginationConfFactory", function() {
		return {
			currentPage: 1,
			noofPages: 10
		};
	});

	eGarageAppFactories.factory("dpConfFactory", function() {
		return {
			format: "MM/DD/YYYY HH:mm",
			useCurrent: true,
			icons: {
				time: "glyphicon glyphicon-time",
				date: "glyphicon glyphicon-calendar",
				up: "glyphicon glyphicon-triangle-top",
				down: "glyphicon glyphicon-triangle-bottom",
				previous: "glyphicon glyphicon-triangle-left",
				next: "glyphicon glyphicon-triangle-right",
				today: "glyphicon glyphicon-screenshot",
				clear: "glyphicon glyphicon-trash",
				close: "glyphicon glyphicon-remove"
			},
			calendarWeeks: true,
			showTodayButton: true,
			showClear: true,
			showClose: true,
			tooltips: {
				today: "Go to today",
				clear: "Clear selection",
				close: "Close the picker",
				selectMonth: "Select Month",
				prevMonth: "Previous Month",
				nextMonth: "Next Month",
				selectYear: "Select Year",
				prevYear: "Previous Year",
				nextYear: "Next Year",
				selectDecade: "Select Decade",
				prevDecade: "Previous Decade",
				nextDecade: "Next Decade",
				prevCentury: "Previous Century",
				nextCentury: "Next Century"
			}
		}
	});

	function triggerRESTAPI($http, method, url, inputObj) {
		this.post = function(callback) {
			$http({
				method: method,
				url: url,
				data: inputObj
			}).then(function successCallback(responseData) {
				// this callback will be called asynchronously
				// when the response is available

				callback(responseData);
			}, function errorCallback(responseData) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				callback(responseData);
			});
		}
	};

	eGarageAppFactories.factory("restAPIFactory", ["$http", function($http) {
		return function(method, url, inputObj) {
			return new triggerRESTAPI($http, method, url, inputObj);
		}
	}]);

	eGarageAppFactories.factory("isArResFactory", function() {
		return function(responseData) {
			if(responseData !== undefined) {
				if(responseData.data !== undefined) {
					if(responseData.data.length) {
						return true;
					}
				}
			}

			return false;
		}
	});

	eGarageAppFactories.factory("isObjResFactory", function() {
		return function(responseData) {
			if(responseData !== undefined) {
				if(responseData.data !== undefined) {
					if(Object.keys(responseData.data).length) {
						return true;
					}
				}
			}

			return false;
		}
	});
})();