(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Canvs = require('./canvs');
var animatr = require('./animatr');
var RESIZOR = require('./RESIZOR');
var PENDULUM_COLORS = require('./PENDULUM_COLORS');
var Pendulu  = require('./Pendulu');
var Vectr2 = require('vectr2');



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
	var amount = 7;
	var pendulums = [];

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

	function makeNewPend (num) {

		var lengf = (window.innerHeight * 0.3) + (num * 24);
		var pendu = new Pendulu(new Vectr2(width /2, 40), lengf,  PENDULUM_COLORS[ colorNames[num] ] );

		pendu.onSwitch(function () {

			//blocks[num].flash();
			//flashColor(num);

		});

		pendulums.push(pendu);
	}



	for(var i = 0; i < amount; i += 1) {
		makeNewPend(i);
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

		for(i = 0; i < pendulums.length; i += 1) {
			pendulums[i].swing();
			//pendulums[i].render(context);
		}

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
},{"./PENDULUM_COLORS":2,"./Pendulu":3,"./RESIZOR":4,"./animatr":5,"./canvs":6,"vectr2":7}],2:[function(require,module,exports){
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
var Vectr2 = require('vectr2');




var Pendulu = function (topPos, leng, fill) {

	this.topPos = topPos; //vectr2
	this.ballPos = new Vectr2(0,0); //vectr2

	this.armLength = leng || 200;
	this.fill = fill || 'rgb(90,90,200)';
	this.aVelocity = 0.0;
	this.aAccel = 0.0;
	this.friction = 0.999;
	this.angle = Math.PI/4;

	this.radius = 40;

	this.side = "left";

};

Pendulu.prototype = {

	switchListeners : [],

	handleSwitch : function () {
		var i = 0;

		for(i =0; i < this.switchListeners.length; i+= 1) {
			this.switchListeners[i]();
		}
	},

	swing : function () {

		
		var gravity = 0.4;
		this.aAccel = (-1 * gravity / this.armLength) * Math.sin(this.angle);
		this.aVelocity += this.aAccel;
		this.angle += this.aVelocity;
		this.aVelocity *= this.friction;


		this.ballPos.set(this.armLength * Math.sin(this.angle), this.armLength*Math.cos(this.angle));
     	this.ballPos.add(this.topPos);

     	if(this.side === "left") {
     		if(this.angle < 0) {
     			this.side = "right";
     			this.handleSwitch();
     			return;
     		}
     	}

     	if(this.side === "right") {
     		if(this.angle > 0) {
     			this.side = "left";
     			this.handleSwitch();
     		}
     	}

	},


	render : function (ctx) {

		ctx.save();
		ctx.globalAlpha = 1;
		ctx.strokeStyle = this.fill;
		ctx.beginPath();
		ctx.moveTo(this.topPos.x, this.topPos.y);
		ctx.lineTo(this.ballPos.x, this.ballPos.y);
		ctx.stroke();
		ctx.closePath();
	
		ctx.beginPath();
		ctx.fillStyle = this.fill;
		ctx.moveTo(this.ballPos.x, this.ballPos.y);
		ctx.arc(this.ballPos.x, this.ballPos.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	},


	onSwitch : function (funk) {

		if(typeof funk === 'function') {
			this.switchListeners.push(funk)
		} else {
			console.warn("you didnt send a function to onSwitch");
		}
		
	},
};


module.exports = Pendulu;
},{"vectr2":7}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
var vectr2 = function (x,y) {

	this.x = x || 0;
	this.y = y || 0;

};

vectr2.prototype = {

	constructor : vectr2,


	set : function (x,y) {
		this.x = x;
		this.y = y;

		return this;
	},


	mag : function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},


	length : function () {
		return this.mag();
	},


	add : function (vec) {
		this.x += vec.x;
		this.y += vec.y;

		return this;
	},


	subtract : function (vec)  {
		this.x += -vec.x;
		this.y += -vec.y;

		return this;
	},


	bisect : function (vec) {
		return this.unit().add(vec.unit()).setMagnitude(110);
	},


	unit : function () {
		var magnitood = this.mag();
		return new vectr2(this.x / magnitood, this.y / magnitood);
	},

	normalize : function () {
		var magnitood = this.mag();
		this.x /= magnitood;
		this.y /= magnitood;

		return this;
	},


	angle : function (vec) {
		var adjacent = this.project(vec).mag(),
		hypoteneuse = this.mag();

		if(hypoteneuse === 0) {
			return 0;
		}

		return Math.acos( adjacent / hypoteneuse );

	},


	leftNormal : function () {
		return new vectr2(this.y, -this.x);
	},


	rightNormal : function () {
		return new vectr2(-this.y, this.x);
	},


	dot : function (vec) {
		return this.x * vec.x + this.y * vec.y;
	},

	project : function (vec) {
		var dotScalar = this.dot(vec) / vec.dot(vec);
		return new vectr2(vec.x * dotScalar, vec.y * dotScalar);
	},


	perpendicular : function (vec) {
		var cloney = this.clone(),
		parallel = this.project(vec);

		return cloney.subtract(parallel);
	},


	multiply : function (scalar) {
		this.x *= scalar;
		this.y *= scalar;

		return this;
	},


	setMagnitude : function (scalar) {
		var unitVec = this.unit();

		this.x = unitVec.x * scalar;
		this.y = unitVec.y * scalar;

		return this;
	},



	max : function (limit) {
		var currentMag = this.mag();
		if(currentMag > limit) {
			this.setMagnitude(limit);
		}

		return this;
	},


	clear : function () {
		this.x = 0;
		this.y = 0;

		return this;
	},



	clone : function () {
		return new vectr2(this.x, this.y);
	},



	render : function (startX, startY, ctx, styl) {

		ctx.save();
		ctx.strokeStyle = styl || 'rgb(255,0,0)';
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(startX - this.x, startY - this.y);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}


};


module.exports = vectr2;

},{}]},{},[1]);
