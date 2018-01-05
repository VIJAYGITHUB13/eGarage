(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp");
	eGarageApp.controller("menusCtrl", menusCtrl);
	menusCtrl.$inject = [
		"$scope",
		"$state",
		"infoMessagesFactory",
		"restAPIFactory",
		"isArResFactory"
	];

	function menusCtrl($scope, $state, infoMessagesFactory, restAPIFactory, isArResFactory) {
		// Objects decleration =>>
		// =======================
		$scope.basePath = $state.current.data.basePath;
		$scope.tabName = $state.current.data.displayName;
		$scope.tabDesc = $state.current.data.displayDesc;

		function initObjs() {
			$scope.menusRESTData = {};
			// $scope.menusFormData = {};
			$scope.menusSbmtData = {};

			$scope.menusRESTData.userCategoriesAr = [];

			$scope.msgObj = {};

			$scope.infoObj = {};
			$scope.infoObj.msg = "Please apply the filter.";
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
							userCategoryID: parseInt(obj.user_category_id),
							userSubcategoryID: parseInt(obj.user_subcategory_id),
							userCategory: obj.user_category,
							userSubcategory: obj.user_subcategory
						});
					});
					angular.copy(responseAr, $scope.menusRESTData.userCategoriesAr);
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

		$scope.searchFormSubmit = function() {
			$scope.infoObj.msg = "Please wait...";
			$scope.menusAr = [];

			var url = $scope.basePath;
			url += "script.php?task=menus";
			var inputObj = {
				userSubcategory: parseInt($scope.menusSbmtData.userSubcategoryModel)
			};

			if(!Object.keys(inputObj).filter(function(key){ return ("" + inputObj[key]); }).length) {
				$scope.infoObj.msg = "Please apply the filter.";
			} else {
				restAPIFactory("POST", url, inputObj).post(function(responseData) {
					if(responseData.statusText === "OK") {
						if(isArResFactory(responseData)) {
							$scope.infoObj.msg = "";

							var menusAr = [];
							angular.forEach(responseData.data, function(obj) {
								var parentID = parseInt(obj.parent_id);
								var childID = parseInt(obj.child_id);

								if(!$scope.filterData(menusAr, "id", parentID).length) {
									if(parentID) {
										menusAr.push({
											id: parentID,
											name: obj.parent_menu,
											selected: (obj.parent_selected === "true"),
											subMenusAr: []
										});
									}
								}

								if(!$scope.filterData($scope.filterData(menusAr, "id", parentID)[0].subMenusAr, "id", childID).length) {
									if(childID) {
										$scope.filterData(menusAr, "id", parentID)[0].subMenusAr.push({
											id: childID,
											name: obj.child_menu,
											selected: (obj.child_selected === "true")
										});
									}
								}
							});

							angular.copy(menusAr, $scope.menusAr);
						} else {
							$scope.infoObj.msg = "No records found.";
						}
					} else {
						$scope.infoObj.msg = "Something went wrong.";
					}
				});
			}
		};

		$scope.assignMenus = function() {
			var msg = "Are you sure?";
			bootbox.confirm({
				message: msg,
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-default"
					},
					confirm: {
						label: "Assign",
						className: "btn-primary"
					}
				},
				callback: function(actionFlag) {
					if(actionFlag) {
						assignMenus();
					}
				}
			});
		};

		function assignMenus() {
			$scope.msgObj = {};
			var menusAr = [];
			angular.forEach($scope.menusAr, function(obj) {
				menusAr.push({
					menuID: obj.id,
					selected: obj.selected
				});

				if(obj.subMenusAr.length) {
					angular.forEach(obj.subMenusAr, function(subObj) {
						menusAr.push({
							menuID: subObj.id,
							selected: subObj.selected
						});
					});
				}
			});

			var url = $scope.basePath;
			url += "script.php?task=assign";
			var inputObj = {
				userSubcategory: $scope.menusSbmtData.userSubcategoryModel,
				menusAr: menusAr
			};

			restAPIFactory("POST", url, inputObj).post(function(responseData) {
				if(responseData.statusText === "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(infoMessagesFactory.success, $scope.msgObj);
							$scope.msgObj.msg = "Assigned the menu(s) successfully.";
						break;

						case "ERROR_DB":
							angular.copy(infoMessagesFactory.danger, $scope.msgObj);
							$scope.msgObj.msg = "Error while assigning the menu(s) details.";
						break;
					}
				} else {
					angular.copy(infoMessagesFactory.danger, $scope.msgObj);
					$scope.msgObj.title += " (" + responseData.status + ")";
					$scope.msgObj.msg = responseData.statusText;
				}

				$scope.searchFormSubmit();
			});
		}

		$scope.parentMenu = function(menu) {
			menu.selected = !menu.selected;

			angular.forEach(menu.subMenusAr, function(obj) {
				obj.selected = menu.selected;
			});
		};

		$scope.childMenu = function(menu, subMenu) {
			subMenu.selected = !subMenu.selected;

			var selected = false;
			angular.forEach(menu.subMenusAr, function(obj) {
				(obj.selected && (selected = true));
			});

			menu.selected = selected;
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