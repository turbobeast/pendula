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