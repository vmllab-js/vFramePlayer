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

	var removeAll = function (dom) {
		for (var i=0;i<dom.childNodes.length;i++){
            dom.removeChild(dom.childNodes[i]);
        }
	};

	var FramePlayer = function (options) {
        var _this = this;
        if(!options){
			console.log("请设置参数！");
			return;
		}

		//dom
		this.dom = options.dom;
		//开始帧
		this.startFrame = 0;
		//结束帧
		this.endFrame = options.imgArr.length-1;
		//当前帧
		this.curFrame = 0;
		//上一帧
		this.prevFrame = 0;
		//fps
		this.fps = options.fps?options.fps:25;
		//是否canvas播放
		this.isCanvas = options.isCanvas?options.isCanvas:false;
		//序列图实例
		this._imgObjArr = [];
		//循环播放
		this.loop = options.loop?options.loop:false;
		//正序接倒序
		this.yoyo = options.yoyo?options.yoyo:false;
		//监听事件
		this._events = {};
		//是否png
		this._isPng = true;

        for(var k in options.imgArr){
            var img = new Image();
            img.src = options.imgArr[k];
            this._imgObjArr.push(img);
        }

		//初始化
        if(_this.isCanvas){

            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = 0;
            this.ctx = canvas.getContext("2d");
            this.dom.appendChild(canvas);

            this._imgObjArr[0].onload = function(){
                _this._isPng = this.src.indexOf(".png") !== -1;
                _this.width = canvas.width = _this._imgObjArr[0].width;
                _this.height = canvas.height = _this._imgObjArr[0].height;
            };

        }else{

            // this.dom.textContent = "";
			_this.mc = document.createElement("div");
            _this.mc.setAttribute("class","mc");
            this.dom.appendChild(_this.mc);
            // mc.style.position = "absolute";
            // mc.style.top = mc.style.left = 0;
            // removeAll(this.dom);
        	for(var i=0;i<this._imgObjArr.length;i++){
                this._imgObjArr[i].style.opacity = 0;
                this._imgObjArr[i].style.position = "absolute";
                this._imgObjArr[i].style.top = this._imgObjArr[i].style.left = 0;
                _this.mc.appendChild(this._imgObjArr[i]);
			}

		}

	};

	FramePlayer.prototype = {
		//设置参数
		set : function (attr, value) {
			if(arguments.length == 1 && typeof(arguments[0]) == "object"){
				for (var i in arguments[0]){
					this[i] = arguments[0][i];
                }
			}
            if(arguments.length == 2){this[arguments[0]] = arguments[1]}
        },
        //播放
		play : function (start,end,options) {
			var _this = this;
            var times = 0;
            var _imgObjArr = this._imgObjArr;
            var argumentsNum = 0;

            for (var i in arguments) {
                switch (typeof(arguments[i])){
                    case "number" :
                        if(argumentsNum == 0){
                            _this.startFrame = _this.curFrame = arguments[i];
                            argumentsNum++;
						}else{
                            _this.endFrame = arguments[i]
                        }
                        break;
                    case "object" :
                        if(arguments[i].onComplete)var onComplete = arguments[i].onComplete;delete arguments[i].onComplete;
                        if(arguments[i].onUpdate)var onUpdate = arguments[i].onUpdate;delete arguments[i].onUpdate;
                        _this.set(arguments[i]);
                        break;
                }
            }

            console.log(_this.startFrame,_this.endFrame);

            var asc = _this.startFrame<_this.endFrame;
            var isPlay = false;
            if(_this._events.play){_this._events.play()}

            this._process = setInterval(function(){
            	if(_imgObjArr[_this.curFrame].complete){

            		if(_this.isCanvas){
                        if(_this._isPng)_this.ctx.clearRect(0,0,_this.width,_this.height);
                        _this.ctx.drawImage(_imgObjArr[_this.curFrame], 0, 0,_this.width,_this.height);
					}else{
                        _this.mc.childNodes[_this.prevFrame].style.opacity = 0;
                        _this.mc.childNodes[_this.curFrame].style.opacity = 1;
					}

					//保存本帧为上一帧
					_this.prevFrame = _this.curFrame;

                    //update回调;
                    if(_this._events.update){_this._events.update(_this.curFrame,times+1,asc)}
                    if(onUpdate)onUpdate(_this.curFrame,times+1,asc);

                    if((_this.curFrame == _this.endFrame || _this.curFrame == _this.startFrame) && isPlay){

                        if(_this.loop && (times+1<_this.loop || _this.loop == -1)){
                        	if(asc){
                                _this.curFrame = Math.max(_this.startFrame,_this.endFrame)-1;
                            }else{
                                _this.curFrame = Math.min(_this.startFrame,_this.endFrame)+1;
                            }
                            times++;
                        	asc = !asc;
                        }else{
                            _this.stop();
                            if(_this._events.stop){_this._events.stop()}
                            if(onComplete)onComplete();
                        }

                    }else{
                    	if(asc){
                            _this.curFrame++;
						}else{
                            _this.curFrame--;
						}
                        isPlay = true;
                    }

                }
			},1000/this.fps);
		},
		stop : function () {
            clearInterval(this._process);
		},
		on : function (_events, handler) {
			this._events[_events] = handler;
		},
		one : function (_events, handler) {
			var _this = this;
            this._events[_events] = function(a,b,c,d,e){
                handler(a,b,c,d,e);
                delete _this._events[_events];
			};
		},
		off : function (_events) {
            if(this._events[_events])delete this._events[_events];
		},
        destroy : function () {
            clearInterval(this._process);
            this._events = {};
        }
	};

	if (typeof define === "function" && define.amd) {
		define("FramePlayer", [], function () {
			return FramePlayer;
		});
	} else {
		window.FramePlayer = FramePlayer;
	}

	return FramePlayer;
	//miller
	
});