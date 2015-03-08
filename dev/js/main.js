var Canvs = require('./canvs');
var animatr = require('./animatr');
var RESIZOR = require('./RESIZOR');
var PENDULUM_COLORS = require('./PENDULUM_COLORS');
var Pendulu  = require('./Pendulu');
var Vectr2 = require('vectr2');
var PenduBlock = require('./PenduBlock');
var colorNames = require('./ColorNames');


(function () {
	"use strict";
	var width = window.innerWidth;
	var height = window.innerHeight;
	var can = new Canvs();
	var context = can.context;
	var canvas = can.canvas;
	var amount = 7;
	var currentBlock = null;
	var pendulums = [];
	var blocks = [];

	function pingServer (num) {

		var url = "https://pendula.herokuapp.com/color/?num=" + (num +1);
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.send(null);

	}

	function makeNewPend (num) {

		var lengf = (window.innerHeight * 0.3) + (num * 24);
		var pendu = new Pendulu(new Vectr2(width /2, 40), lengf,  PENDULUM_COLORS[ colorNames[num] ] );

		pendu.onSwitch(function () {
			//pingServer(num);
			
			//blocks[num].flash();
			//currentBlock = blocks[num];
		});

		pendulums.push(pendu);
	}

	function makeNewBlock (num) {
		var blok = new PenduBlock(num);
		blocks.push(blok);
	}


	for(var i = 0; i < amount; i += 1) {
		makeNewPend(i);
	}

	for(var i = 0; i < amount; i += 1) {
		makeNewBlock(i);
	}

	
	//Math.floor(Math.random() * colorNames.length)
	// function flashColor (num) {
	// 	//var newColr = PENDULUM_COLORS[ colorNames[num] ];
	// 	currentColor = PENDULUM_COLORS[ colorNames[num] ];
	// 	globAlf = 1;
	// 	alphaVel = 0.04;
	// }


	// function fadeAlpha () {
		
	// 	alphaVel *= 0.98;
	// 	//alphaVel += alphaAccel;
	// 	globAlf -= alphaVel;
	// 	if(globAlf <= 0) {
	// 		globAlf = 0;
	// 	}
		
	// }


	animatr.onFrame(function () {

		//fadeAlpha();
		context.save();

		var i = 0;

		//darkness
		context.globalAlpha = 0.1;
		context.fillStyle = 'rgb(2,4,22)';
		context.fillRect(0,0,width, height);

		for(i = 0; i < blocks.length; i += 1) {
			blocks[i].update();

			if(blocks[i] === currentBlock) {
				blocks[i].render(context);
			}
			//blocks[i].render(context);
		}
		//color

		for(i = 0; i < pendulums.length; i += 1) {
			//pendulums[i].swing();
			//pendulums[i].render(context);
		}

		context.restore();

	});



	RESIZOR.addHandler(function (wid,hite) {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = wid;
		canvas.height = hite;

		var i = 0;
		for(i = 0; i < blocks.length; i += 1) {
			blocks[i].resize();
		}

	});


	if(typeof io === 'function') {
		var socket = io.connect(window.location.hostname + ":" + window.location.port );
		socket.on("FLASH", function (num) {

			
			//sanitize
			if(isNaN(num)) { num = Math.ceil(Math.random() * 7); }
			if(num < 1) { num = 1; }
			if(num > amount) { num = amount; }

			blocks[num-1].flash();
			currentBlock = blocks[num-1];
			// flashColor(num-1);

		});
	} else {
		console.warn('no socket io');
	}
	
	RESIZOR.init();
	animatr.init();


}());