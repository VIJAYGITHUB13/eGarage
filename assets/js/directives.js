(function() {
	"use strict";

	var eGarageAppDirectives = angular.module("eGarageAppDirectives", []);

	eGarageAppDirectives.directive("dirCompileTemplate", function($sce) {
		return {
			restrict: "E",
			scope: {
				inputData: "="
			},
			template: function() {
				var tpl = '';
				tpl += '<span ng-bind-html="outputData"></span>';

				return tpl;
			},
			link: function($scope) {
				$scope.outputData = $sce.trustAsHtml($scope.inputData);
			}
		}
	});

	eGarageAppDirectives.directive("dirPageHeader", function() {
		return {
			restrict: "E",
			scope: {
				tabName: "=",
				tabDesc: "="
			},
			template: function() {
				var tpl = '';
				tpl += '<div class="page-header" style="margin: 0; margin-bottom: 15px;">';
					tpl += '<h3>{{ tabName }} <small class="hidden-xs">{{ tabDesc }}</small></h3>';
				tpl += '</div>';

				return tpl;
			}
		}
	});

	eGarageAppDirectives.directive("dirAlert", function(alertMessagesFactory) {
		return {
			restrict: "E",
			scope: {
				alertType: "=",
				alertMsg: "="
			},
			template: function() {
				var tpl = '';
				tpl += '<div';
					tpl += ' class="alert alert-dismissible dir-alert"';
					tpl += ' role="alert"';
					tpl += ' ng-class="alertMessageObj.alertName"';
					tpl += ' ng-style="{ \'border-color\': alertMessageObj.borderColor }">';
					tpl += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
						tpl += '<span aria-hidden="true">&times;</span>';
					tpl += '</button>';
					tpl += '<div class="media">';
						tpl += '<div class="media-left">';
							tpl += '<span class="glyphicon" ng-class="alertMessageObj.glyphicon"></span>';
						tpl += '</div>';
						tpl += '<div class="media-body">';
							tpl += '<strong>{{ alertMessageObj.title }}:</strong>';
							tpl += '<span class="alert-msg">{{ alertMessageObj.msg }}</span>';
						tpl += '</div>';
					tpl += '</div>';
				tpl += '</div>';

				return tpl;
			},
			link: function($scope) {
				$scope.alertMessageObj = {};
				angular.copy(alertMessagesFactory[$scope.alertType], $scope.alertMessageObj);
				$scope.alertMessageObj.msg = $scope.alertMsg;
			}
		}
	});

	eGarageAppDirectives.directive("dirPaginationHeader", ["paginationConfFactory", function(paginationConfFactory) {
		return {
			restrict: "E",
			scope: {
				noofPages: "=",
				currentPage: "=",
				headerTitle: "="
			},
			link: function($scope) {
				$scope.noofPages = paginationConfFactory.noofPages;
				$scope.currentPage = paginationConfFactory.currentPage;
			},
			template: function() {
				var tpl = '';
				tpl += '<form class="form-horizontal margin-bottom">';
					tpl += '<div class="form-group" style="margin-bottom: 0;">';
						tpl += '<div class="col-xs-5 col-sm-3">';
							tpl += '<h5><strong>{{ headerTitle || "Search Result" }}</strong></h5>';
						tpl += '</div>';
						tpl += '<label for="noofpages" class="hidden-xs col-sm-3 col-md-4 control-label" style="text-align: right;">No of pages</label>';
						tpl += '<div class="hidden-xs col-sm-2 col-lg-2">';
							tpl += '<input type="number" class="form-control input-sm" id="noofpages" name="noofpages" min="1" max="100" ng-model="noofPages" />';
						tpl += '</div>';
						tpl += '<div class="col-xs-7 col-sm-4 col-md-3">';
							tpl += '<input type="text" class="form-control input-sm" placeholder="Search results" ng-model="tableSearch" />';
						tpl += '</div>';
					tpl += '</div>';
				tpl += '</form>';

				return tpl;
			}
		}
	}]);

	eGarageAppDirectives.directive("dirValidFile", function() {
		return {
			require: "ngModel",
			link: function(scope, el, attrs, ngModel) {
				scope.extAr = ["xls"];

				el.bind("change",function() {
					scope.$apply(function() {
						var fname = el.val();

						if(scope.extAr.indexOf(fname.substr(fname.lastIndexOf(".") + 1)) != -1) {
							ngModel.$setViewValue(el.val());
						}

						ngModel.$render();
					});
				});
			}
		}
	});

	eGarageAppDirectives.directive("dirEpochToDate", function($filter) {
		return {
			restrict: "E",
			scope: {
				inputData: "="
			},
			template: "{{ outputData }}",
			link: function($scope) {
				if($scope.inputData) {
					var format = "dd-MM-yyyy";
					$scope.outputData = $filter("date")($scope.inputData, format);
				} else {
					$scope.outputData = "NA";
				}
			}
		};
	});

	eGarageAppDirectives.directive("dirEpochToDatetime", function($filter) {
		return {
			restrict: "E",
			scope: {
				inputData: "="
			},
			template: "{{ outputData }}",
			link: function($scope) {
				if($scope.inputData) {
					var format = "dd-MM-yyyy hh:mm a";
					$scope.outputData = $filter("date")($scope.inputData, format);
				} else {
					$scope.outputData = "NA";
				}
			}
		};
	});

	eGarageAppDirectives.directive("dirPrintHeading", function(estdInfoService) {
		return {
			restrict: "E",
			template: function() {
				var tpl = '';
				tpl += '<div ng-if="!name">';
					tpl += '<h3 class="text-center"><strong>eGarage</strong></h3>';
				tpl += '</div>';
				// tpl += '<div class="row" ng-if="name">';
				// 	tpl += '<div class="col-sm-3">';
				// 		tpl += '<img ng-src="{{ \'app/home/misc/establishment/images/\' + logo }}" style="width: 100px;" />';
				// 	tpl += '</div>';
				// 	tpl += '<div class="col-sm-6">';
				// 		tpl += '<h3 class="text-center"><strong>{{ name }}</strong></h3>';
				// 		tpl += '<h5 class="text-center"><strong>{{ address }}</strong></h5>';
				// 		tpl += '<h5 class="text-center">{{ contact }}</h5>';
				// 	tpl += '</div>';
				// tpl += '</div>';
				tpl += '<table ng-if="name"><tr>';
					tpl += '<td style="width: 20%;">';
						tpl += '<img ng-if="logo" ng-src="{{ \'app/home/misc/establishment/images/\' + logo }}" style="width: 75px;" />';
					tpl += '</td>';
					tpl += '<td style="width: 60%;">';
						tpl += '<h3 class="text-center"><strong>{{ name }}</strong></h3>';
						tpl += '<h5 ng-if="address" class="text-center"><strong>{{ address }}</strong></h5>';
						tpl += '<h5 ng-if="contact" class="text-center">{{ contact }}</h5>';
					tpl += '</td>';
					tpl += '<td style="width: 20%;">';
						tpl += '&nbsp;';
					tpl += '</td>';
				tpl += '</tr></table>';

				return tpl;
			},
			link: function($scope) {
				var estdObj = estdInfoService.getInfo();
				if(estdObj.name) {
					$scope.name = estdObj.name;
					$scope.address = estdObj.address;
					$scope.contact = estdObj.contact;
					$scope.logo = estdObj.logo;
				}
			}
		};
	});
})();