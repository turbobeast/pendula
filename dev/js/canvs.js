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