(function() {
	"use strict";

	var eGarageAppServices = angular.module("eGarageAppServices", []);

	eGarageAppServices.service("appInfoService", function() {
		return {
			setInfo: function(inputObj) {
				this.inputObj = inputObj;
			},
			getInfo: function() {
				return this.inputObj;
			}
		};
	});

	eGarageAppServices.service("userInfoService", function() {
		return {
			setInfo: function(inputObj) {
				this.inputObj = inputObj;
			},
			getInfo: function() {
				return this.inputObj;
			}
		};
	});

	eGarageAppServices.service("estdInfoService", function() {
		return {
			setInfo: function(inputObj) {
				this.inputObj = inputObj;
			},
			getInfo: function() {
				return this.inputObj;
			}
		};
	});

	eGarageAppServices.service("alertInfoService", function() {
		return {
			setInfo: function(inputObj) {
				this.inputObj = inputObj;
			},
			getInfo: function() {
				return this.inputObj;
			},
			clearInfo: function() {
				delete this.inputObj;
			}
		};
	});

	eGarageAppServices.service("userDetailsService", function() {
		return {
			setInfo: function(inputObj) {
				this.inputObj = inputObj;
			},
			getInfo: function() {
				return this.inputObj;
			},
			clearInfo: function() {
				delete this.inputObj;
			}
		};
	});

	eGarageAppServices.service("userUploadFileService", function() {
		return {
			setInfo: function(inputObj) {
				this.inputObj = inputObj;
			},
			getInfo: function() {
				return this.inputObj;
			},
			clearInfo: function() {
				delete this.inputObj;
			}
		};
	});

	eGarageAppServices.service("userUploadService", function() {
		return {
			setInfo: function(inputObj) {
				this.inputObj = inputObj;
			},
			getInfo: function() {
				return this.inputObj;
			},
			clearInfo: function() {
				delete this.inputObj;
			}
		};
	});

	eGarageAppServices.service("requestDetailsService", function() {
		return {
			setInfo: function(inputObj) {
				this.inputObj = inputObj;
			},
			getInfo: function() {
				return this.inputObj;
			},
			clearInfo: function() {
				delete this.inputObj;
			}
		};
	});
})();