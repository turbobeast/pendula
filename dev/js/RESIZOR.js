var RESIZOR = (function () {
	'use strict';
	var sizor = {},
	heavyDuty,
	relay,
	handlers = [],
	onciez = [],
	resizeTimer = null;

	heavyDuty = function () {
		resizeTimer = null;

		var i = 0,
		width = window.innerWidth,
		height = window.innerHeight;

		for(i = 0; i < handlers.length; i += 1) {
			handlers[i](width, height);
		}

		for(i = 0; i < onciez.length; i += 1) {
			onciez[i](width, height);
		}

		onciez = [];
	};

	relay = function (e) {

		if(e) { e.preventDefault(); }
		if(resizeTimer !== null) {
			clearTimeout(resizeTimer);
		}
		resizeTimer = setTimeout(heavyDuty, 200);
	};

	sizor.addHandler = function (funk) {
		if(typeof funk === 'function') {
			handlers.push(funk);
		}
	};

	sizor.once = function (funk) {
		if(typeof funk === 'function') {
			onciez.push(funk);
		}
	}

	sizor.init = function () {
		heavyDuty();
		window.addEventListener("resize", relay);
		//$(window).bind('resize', relay);
	};

	return sizor;

}());	

module.exports = RESIZOR;