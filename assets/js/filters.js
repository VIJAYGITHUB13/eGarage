(function() {
	"use strict";

	var eGarageAppFilters = angular.module("eGarageAppFilters", []);

	eGarageAppFilters.filter("formatDateYMDHHMMA", function() {
		return function(inputData) {
			var dateStr = inputData;
			var dateStrAr = dateStr.split(" ");
			var ymdStr = (dateStrAr[0].split("-").reverse().join("-"));
			var hhmmStr = dateStrAr[1];
			var ampmStr = dateStrAr[2];

			var hhmmStrAr = hhmmStr.split(":");
			hhmmStrAr[0] = parseInt(hhmmStrAr[0]);
			
			if(hhmmStrAr[0] === 12) {
				hhmmStrAr[0] = 0;
			}

			if(ampmStr === "PM") {
				hhmmStrAr[0] = ((hhmmStrAr[0] + 12) % 24);
				if(hhmmStrAr[0] === 0) {
					hhmmStrAr[0] = 12;
				}
			}

			if(hhmmStrAr[0] < 10) {
				hhmmStrAr[0] = ("0" + hhmmStrAr[0]);
			}

			hhmmStrAr[2] = "00";

			return (ymdStr + " " + hhmmStrAr.join(":"));
		}
	});

	eGarageAppFilters.filter("msToHHMM", function() {
		return function(inputData) {
			var duration = inputData;

			var seconds = parseInt(inputData / 1000);
			var hours = parseInt(seconds / (60 * 60));
			seconds = (seconds % (60 * 60));
			var minutes = parseInt(seconds / 60);

			hours = ((hours < 10) ? ("0" + hours) : hours);
			minutes = ((minutes < 10) ? ("0" + minutes) : minutes);

			return (hours + ":" + minutes);
		}
	});

	eGarageAppFilters.filter("dmyToMDY", function() {
		return function(inputData) {
			var dateStrAr = inputData.split("-");

			var temp = dateStrAr[0];
			dateStrAr[0] = dateStrAr[1];
			dateStrAr[1] = temp;

			return dateStrAr.join("-");
		}
	});

	eGarageAppFilters.filter("toDecimal", function() {
		return function(num, decimalPlaces) {
			decimalPlaces = (decimalPlaces || 2);
			var num = parseFloat(num);
			num = parseFloat(num.toFixed(decimalPlaces));
			return ((!isNaN(num) && num) || 0);
		}
	});
})();