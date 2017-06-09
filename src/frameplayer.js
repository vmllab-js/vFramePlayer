/**
 * frameplayer v0.0.1
 *
 * https://github.com/vmllab-js/FramePlayer | Released under MIT license
 *
 * @author vmllab
 * @since 2017-06-02
 * @link http://vmllab.im20.com.cn
 */
(function (global, factory) {

	"use strict";

	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = factory(global, true);
	} else {
		factory(global);
	}

})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

	"use strict";

	var rAF = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};

	var frameplayer = function (dom,imgArr,fps) {
		var _this = this;
		//开始帧
		this.startFrame = 0;
		//结束帧
		this.endFrame = imgArr.length-1;
		this.fps = fps?fps:25;
		this.imgObj = [];

		//初始化
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 640;
        this.ctx = canvas.getContext("2d");
        for(var k in imgArr){
            var img = new Image();
            img.src = imgArr[k];
            this.imgObj.push(img);
        }
        dom.appendChild(canvas);

        this.imgObj[0].onload = function(){
            _this.width = canvas.width = _this.imgObj[0].width;
            _this.height = canvas.height = _this.imgObj[0].height;
        };

	};

	frameplayer.prototype = {
        //播放
		play : function (options) {
			var _this = this;
            var times = 1;
            var imgObj = this.imgObj;

            if(options){
                var yoyo = !!options.yoyo;
                var repeat = options.repeat?options.repeat:false;
                var onComplete = options.onComplete?options.onComplete:function(){};
                var onUpdate = options.onUpdate?options.onUpdate:function(){};
			}

            this._process = setInterval(function(){
            	if(imgObj[_this.startFrame].complete){
                    _this.ctx.clearRect(0,0,_this.width,_this.height);
                    _this.ctx.drawImage(imgObj[_this.startFrame], 0, 0,_this.width,_this.height);

                    _this.startFrame++;

                    if(_this.startFrame >= _this.endFrame){
                        clearInterval(_this._process);
                    }

                }
			},1000/this.fps);
		}
	};

	if (typeof define === "function" && define.amd) {
		define("frameplayer", [], function () {
			return frameplayer;
		});
	} else {
		window.frameplayer = frameplayer;
	}

	return frameplayer;
	//miller
	
});