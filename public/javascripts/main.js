(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./PENDULUM_COLORS":2,"./RESIZOR":3,"./animatr":4,"./canvs":5}],2:[function(require,module,exports){
var PENDULUM_COLORS = {
	ONE : 'rgb(243, 122, 162)', //pink
	TWO : 'rgb(66,222,162)', //green
	THREE : 'rgb(6,222,252)', //blue
	FOUR : 'rgb(193,55,122)', ///magenta
	FIVE : 'rgb(253,255,102)', ///yellr
	SIX : 'rgb(151,77,242)', //bright green
	SEVEN : 'rgb(251,122,12)' //orangw 	
};

module.exports = PENDULUM_COLORS;

//'rgb(23,255,102)'//bright green
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
var animatr = (function () {
	var anim = {},
  	paused = false,
  	listeners = [],
	animFrame = (function(){
          return  window.requestAnimationFrame       ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame    ||
                  window.oRequestAnimationFrame      ||
                  window.msRequestAnimationFrame     ||
                  function(/* function */ callback/*,  DOMElement  element */){
                    window.setTimeout(callback, 1000 / 60);
                  };
    }());

	function looper () {
    	var i = 0;

    	for(i = 0 ; i < listeners.length; i ++ ) {
    		listeners[i]();
    	}
    	if(!paused) {
    		animFrame(looper);
    	}
    }

    anim.pause = function () {
      paused = true;
    };

    anim.resume = function () {
      paused = false;
      looper();
    };

    anim.togglePause = function () {
      if(paused) {
        anim.resume();
      } else {
        anim.pause();
      }
    };

    anim.onFrame = function (func) {
    	if(typeof func === 'function') {
    		listeners.push(func);
    	} else {
    		console.error('on Frame expects a function');
    	}
    };

    anim.init = function () {
    	looper();
    };

	return anim;

}());


module.exports = animatr;
},{}],5:[function(require,module,exports){
var canvs = function (w, h, tainer, td) {
	
	var width = w || window.innerWidth;
	var height = h || window.innerHeight;
	var container = tainer || document.body;
	var threeD = td || false;

	this.pixelRatio = window.devicePixelRatio;
	this.canvas = document.createElement('canvas');


	this.context = this.canvas.getContext('2d');

	

	container.appendChild(this.canvas);
};


module.exports = canvs
},{}]},{},[1]);
