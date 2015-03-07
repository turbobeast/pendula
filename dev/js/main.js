var Canvs = require('./canvs');
var animatr = require('./animatr');
var RESIZOR = require('./RESIZOR');
var PENDULUM_COLORS = require('./PENDULUM_COLORS');

(function () {

	var width = window.innerWidth;
	var height = window.innerHeight;
	var can = new Canvs();
	var context = can.context;
	var canvas = can.canvas;
	var globAlf = 0;
	var blueVal = 0;
	var currentColor = PENDULUM_COLORS.ONE;
	var colorNames = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN"];
	var alphaAccel = 0.002;
	var alphaVel = 0;

	//Math.floor(Math.random() * colorNames.length)
	function flashColor (num) {
		//var newColr = PENDULUM_COLORS[ colorNames[num] ];
		currentColor = PENDULUM_COLORS[ colorNames[num] ];
		globAlf = 1;
		alphaVel = 0.04;
	}


	function fadeAlpha () {
		
		alphaVel *= 0.98;
		//alphaVel += alphaAccel;
		globAlf -= alphaVel;
		if(globAlf <= 0) {
			globAlf = 0;
		}
		
	}


	animatr.onFrame(function () {

		fadeAlpha();
		context.save();

		//darkness
		context.fillStyle = 'rgb(42,2,12)';
		context.fillRect(0,0,width, height);
		//color
		context.globalAlpha = globAlf
		context.fillStyle = currentColor;
		context.fillRect(0,0,width, height);

		context.restore();

	});



	RESIZOR.addHandler(function (wid,hite) {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = wid;
		canvas.height = hite;
	});

	if(typeof io === 'function') {
		var socket = io.connect(window.location.hostname + ":" + window.location.port );
		socket.on("FLASH", function (num) {

			console.log('received flash message');
			//sanitize
			if(isNaN(num)) { num = Math.ceil(Math.random() * 7); }
			if(num < 1) { num = 1; }
			if(num > 7) { num = 7; }

			flashColor(num-1);

		});
	} else {
		console.warn('no socket io');
	}
	
	RESIZOR.init();
	animatr.init();


}());