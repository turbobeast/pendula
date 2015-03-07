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