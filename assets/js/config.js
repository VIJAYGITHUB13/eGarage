// Application definition with routing technique and initial point
(function() {
	"use strict";

	var eGarageApp = angular.module("eGarageApp", [
		"eGarageAppFilters",
		"eGarageAppDirectives",
		"eGarageAppFactories",
		"eGarageAppServices",
		"ui.router",
		"ui.bootstrap",
		"ds.clock",
		"angularUtils.directives.uiBreadcrumbs",
		"angularUtils.directives.dirPagination",
		"datetimepicker"
	]);
	eGarageApp.config(eGarageAppConfig);

	function eGarageAppConfig($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state("public", {
			url: "/public",
			views: {
				"main": {
					templateUrl: "app/public/template.html",
					controller: "publicCtrl"
				},
				"index@public": {
					templateUrl: "app/public/main.template.html",
					controller: "publicMainCtrl"
				}
			},
			data: {
				basePath: "app/public/",
				displayName: "Home"
			}
		})
		.state("public.aboutus", {
			url: "/aboutus",
			views: {
				"index@public": {
					templateUrl: "app/public/aboutus/template.html",
					controller: "aboutUsCtrl"
				}
			},
			data: {
				displayName: "About us",
				displayDesc: "Something about us"
			}
		})
		.state("public.contactus", {
			url: "/contactus",
			views: {
				"index@public": {
					templateUrl: "app/public/contactus/template.html",
					controller: "contactUsCtrl"
				}
			},
			data: {
				displayName: "Contact us",
				displayDesc: "Address and landline details"
			}
		});

		$stateProvider
		.state("home", {
			url: "/home",
			views: {
				"main": {
					templateUrl: "app/home/template.html",
					controller: "homeCtrl"
				},
				"index@home": {
					templateUrl: "app/home/main.template.html",
					controller: "homeMainCtrl"
				}
			},
			data: {
				basePath: "app/home/",
				displayName: "Home"
			}
		})
		.state("home.myprofile", {
			url: "/myprofile",
			views: {
				"index@home": {
					templateUrl: "app/home/myprofile/template.html",
					controller: "myProfileCtrl"
				}
			},
			data: {
				basePath: "app/home/myprofile/",
				displayName: "My Profile",
				displayDesc: "Personal and contact details"
			}
		})
		.state("home.myprofile.update", {
			url: "/update",
			views: {
				"index@home": {
					templateUrl: "app/home/myprofile/update/template.html",
					controller: "myProfileUpdateCtrl"
				}
			},
			data: {
				basePath: "app/home/myprofile/update/",
				displayName: "Edit",
				displayDesc: "Update your details"
			}
		})
		.state("home.changepassword", {
			url: "/changepassword",
			views: {
				"index@home": {
					templateUrl: "app/home/changepassword/template.html",
					controller: "changePasswordCtrl"
				}
			},
			data: {
				basePath: "app/home/changepassword/",
				displayName: "Change Password",
				displayDesc: "Securing the login"
			}
		})
		.state("home.users", {
			url: "/users",
			data: {
				displayName: "Users"
			}
		})
		.state("home.users.view", {
			url: "/view",
			views: {
				"index@home": {
					templateUrl: "app/home/users/view/template.html",
					controller: "usersViewCtrl"
				}
			},
			data: {
				basePath: "app/home/users/view/",
				displayName: "View",
				displayDesc: "List of users details"
			}
		})
		.state("home.users.view.details", {
			url: "/details",
			views: {
				"index@home": {
					templateUrl: "app/home/users/view/details/template.html",
					controller: "userDetailsCtrl"
				}
			},
			data: {
				basePath: "app/home/users/view/details/",
				displayName: "Details",
				displayDesc: "Innerview of user details"
			}
		})
		.state("home.users.view.update", {
			url: "/update",
			views: {
				"index@home": {
					templateUrl: "app/home/users/view/update/template.html",
					controller: "userUpdateDetailsCtrl"
				}
			},
			data: {
				basePath: "app/home/users/view/update/",
				displayName: "Update",
				displayDesc: "Update user details"
			}
		})
		.state("home.users.create", {
			url: "/create",
			views: {
				"index@home": {
					templateUrl: "app/home/users/create/template.html",
					controller: "userCreateCtrl"
				}
			},
			data: {
				basePath: "app/home/users/create/",
				displayName: "Create",
				displayDesc: "Introducing user to eGarage"
			}
		})
		.state("home.users.upload", {
			url: "/upload",
			views: {
				"index@home": {
					templateUrl: "app/home/users/upload/template.html",
					controller: "userUploadCtrl"
				}
			},
			data: {
				basePath: "app/home/users/upload/",
				displayName: "Bulk Upload",
				displayDesc: "Introducing multiple users to eGarage"
			}
		})
		.state("home.users.upload.confirm", {
			url: "/confirm",
			views: {
				"index@home": {
					templateUrl: "app/home/users/upload/confirm/template.html",
					controller: "userUploadConfirmCtrl"
				}
			},
			data: {
				basePath: "app/home/users/upload/confirm/",
				displayName: "Confirm",
				displayDesc: "Verify the details pre-submission"
			}
		})
		.state("home.requests", {
			url: "/requests",
			data: {
				displayName: "Service Requests"
			}
		})
		.state("home.requests.view", {
			url: "/view",
			views: {
				"index@home": {
					templateUrl: "app/home/requests/view/template.html",
					controller: "requestsViewCtrl"
				}
			},
			data: {
				basePath: "app/home/requests/view/",
				displayName: "View",
				displayDesc: "List of requests details"
			}
		})
		.state("home.requests.view.details", {
			url: "/details",
			views: {
				"index@home": {
					templateUrl: "app/home/requests/view/details/template.html",
					controller: "requestDetailsCtrl"
				}
			},
			data: {
				basePath: "app/home/requests/view/details/",
				displayName: "Details",
				displayDesc: "Innerview of request details"
			}
		})
		.state("home.requests.view.update", {
			url: "/update",
			views: {
				"index@home": {
					templateUrl: "app/home/requests/view/update/template.html",
					controller: "requestUpdateDetailsCtrl"
				}
			},
			data: {
				basePath: "app/home/requests/view/update/",
				displayName: "Update",
				displayDesc: "Update request details"
			}
		})
		.state("home.requests.create", {
			url: "/create",
			views: {
				"index@home": {
					templateUrl: "app/home/requests/create/template.html",
					controller: "requestCreateCtrl"
				}
			},
			data: {
				basePath: "app/home/requests/create/",
				displayName: "Create",
				displayDesc: "Registering a request"
			}
		})
		.state("home.requests.quotation", {
			url: "/quotation",
			views: {
				"index@home": {
					templateUrl: "app/home/requests/quotation/template.html",
					controller: "requestQuotationCtrl"
				}
			},
			data: {
				basePath: "app/home/requests/quotation/",
				displayName: "Quotation",
				displayDesc: "Create and control quotation"
			}
		})
		.state("home.manage", {
			url: "/manage",
			data: {
				displayName: "Manage"
			}
		})
		.state("home.manage.menus", {
			url: "/menus",
			views: {
				"index@home": {
					templateUrl: "app/home/manage/menus/template.html",
					controller: "menusCtrl"
				}
			},
			data: {
				basePath: "app/home/manage/menus/",
				displayName: "Menus",
				displayDesc: "Management of menus"
			}
		})
		.state("home.manage.storageitems", {
			url: "/storageitems",
			views: {
				"index@home": {
					templateUrl: "app/home/manage/storageitems/template.html",
					controller: "storageItemsCtrl"
				}
			},
			data: {
				basePath: "app/home/manage/storageitems/",
				displayName: "Storage Items",
				displayDesc: "List and manage units"
			}
		})
		.state("home.manage.suppliers", {
			url: "/suppliers",
			views: {
				"index@home": {
					templateUrl: "app/home/manage/suppliers/template.html",
					controller: "suppliersCtrl"
				}
			},
			data: {
				basePath: "app/home/manage/suppliers/",
				displayName: "Suppliers",
				displayDesc: "List and manage suppliers"
			}
		})
		.state("home.accounts", {
			url: "/accounts",
			data: {
				displayName: "Accounts"
			}
		})
		.state("home.accounts.purchaseorder", {
			url: "/purchaseorder",
			views: {
				"index@home": {
					templateUrl: "app/home/accounts/purchaseorder/template.html",
					controller: "purchaseOrderCtrl"
				}
			},
			data: {
				basePath: "app/home/accounts/purchaseorder/",
				displayName: "Purchase Order",
				displayDesc: "Loading storage items"
			}
		})
		.state("home.reports", {
			url: "/reports",
			data: {
				displayName: "Accounts"
			}
		})
		.state("home.reports.orders", {
			url: "/orders",
			views: {
				"index@home": {
					templateUrl: "app/home/reports/orders/template.html",
					controller: "ordersCtrl"
				}
			},
			data: {
				basePath: "app/home/reports/orders/",
				displayName: "Orders",
				displayDesc: "List Orders"
			}
		})
		.state("home.reports.ordersbyduration", {
			url: "/ordersbyduration",
			views: {
				"index@home": {
					templateUrl: "app/home/reports/ordersbyduration/template.html",
					controller: "ordersByDurationCtrl"
				}
			},
			data: {
				basePath: "app/home/reports/ordersbyduration/",
				displayName: "Orders by Duration",
				displayDesc: "List orders by duration"
			}
		})
		.state("home.reports.invoicesbyduration", {
			url: "/invoicesbyduration",
			views: {
				"index@home": {
					templateUrl: "app/home/reports/invoicesbyduration/template.html",
					controller: "invoicesByDurationCtrl"
				}
			},
			data: {
				basePath: "app/home/reports/invoicesbyduration/",
				displayName: "Invoices by Duration",
				displayDesc: "List invoices by duration"
			}
		})
		.state("home.misc", {
			url: "/misc",
			data: {
				displayName: "Misc"
			}
		})
		.state("home.misc.resetpassword", {
			url: "/resetpassword",
			views: {
				"index@home": {
					templateUrl: "app/home/misc/resetpassword/template.html",
					controller: "resetPasswordCtrl"
				}
			},
			data: {
				basePath: "app/home/misc/resetpassword/",
				displayName: "Reset Password",
				displayDesc: "Initializing login"
			}
		})
		.state("home.misc.establishment", {
			url: "/establishment",
			views: {
				"index@home": {
					templateUrl: "app/home/misc/establishment/template.html",
					controller: "establishmentCtrl"
				}
			},
			data: {
				basePath: "app/home/misc/establishment/",
				displayName: "Establishment",
				displayDesc: "Title the Establishment"
			}
		});

		$urlRouterProvider.otherwise("/public");
	}
})();