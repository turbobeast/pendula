var PENDULUM_COLORS = require('./PENDULUM_COLORS');
var colorNames = require('./ColorNames');


var PenduBlock = function (num, total) {
	
	this.total = total;
	this.fill = PENDULUM_COLORS[ colorNames[num] ];
	this.height = window.innerHeight/this.total;
	this.width = window.innerWidth;
	this.y = (window.innerHeight / this.total) * num;
	this.x = 0;
	this.alf = 0.0;
	this.alphaVel = 0;
	this.num = num;


};


PenduBlock.prototype = {
	
	resize : function () {

		this.height = window.innerHeight/this.total;
		this.width = window.innerWidth;
		this.y = (window.innerHeight / this.total) * this.num;
	},


	flash : function () {

		this.alf = 1.0;
		this.alphaVel = 0.04;

	},



	update : function () {

		this.alphaVel *= 0.98;
		this.alf -= this.alphaVel;
		if(this.alf <= 0) {
			this.alf = 0;
		}

	},


	render : function (ctx) {

		ctx.save();
		ctx.globalAlpha = this.alf;
		ctx.fillStyle = this.fill;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();

	}

};


module.exports = PenduBlock;