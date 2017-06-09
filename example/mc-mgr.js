/**
 * Created by lipei on 2016/11/8.
 */
var mcMgr;
!function(){
    mcMgr = function (imgArr,fps,width,height) {
        this.startFrame = 0;  //开始帧
        this.endFrame = imgArr.length-1;  //结束帧
        this.width = width;
        this.height = height;
        this.imgArr = imgArr;
        this.fps = fps;
        this.frameRate = 1000/this.fps;
    };
    mcMgr.prototype = {
        init : function (Callback) {
            var self = this;

            var canvas = document.createElement('canvas');
            canvas.width=self.width;
            canvas.height=self.height;
            self.ctx = canvas.getContext("2d");
            self.imgObj = [];

            for(var k in self.imgArr){
                var img = new Image();
                img.src = self.imgArr[k];
                self.imgObj.push(img);
            }

            self.endFrame = self.imgObj.length - 1;

            Callback(canvas);

            // ResLoader.ImageLoader.create(this.imgArr, function (e) {
            //     var canvas = document.createElement('canvas');
            //     canvas.width=self.width;
            //     canvas.height=self.height;
            //     self.ctx = canvas.getContext("2d");
            //     self.imgObj = [];
            //     console.log(e);
            //     for(var k in e){
            //         self.imgObj.push(e[k]);
            //     }
            //     setTimeout(function(){
            //         Callback(canvas);
            //     },1000);
            // });
            // loadingMgr.loadImages(this.imgArr,function(e){
            //     self.element.append("<canvas style='width:100%;height:100%;'></canvas>");
            //     self.ctx = self.element.find("canvas").get(0).getContext("2d");
            //     self.imgObj = e;
            //     Callback();
            // })
        },
        play : function (settings) {

            var self = this;
            var times = 1;
            var loop = settings.loop?settings.loop:false;
            var yoyo = settings.yoyo?settings.yoyo:false;
            var repeat = settings.repeat?settings.repeat:false;
            var onComplete = settings.onComplete?settings.onComplete:function(){};
            var onUpdate = settings.onUpdate?settings.onUpdate:function(){};
            var end = self.startFrame > self.endFrame;


            this.process = setInterval(function(){

                if(yoyo){
                    end = (times%2 == 0)?self.startFrame < 0:self.startFrame > self.endFrame;
                }else{
                    end = self.startFrame > self.endFrame;
                }

                if(repeat == false){

                    if(loop == true){

                        if(end){
                            if(yoyo){
                                self.startFrame = (times%2 == 0)?1:self.endFrame-1;
                            }else{
                                self.startFrame = 0;
                            }
                            times++;
                            return;
                        }

                    }else{

                        if(end){
                            self.stop();
                            self.startFrame = 0;
                            onComplete();
                            return;
                        }

                    }

                }else{

                    if(repeat > times && end){
                        if(yoyo){
                            self.startFrame = (times%2 == 0)?1:self.endFrame-1;
                        }else{
                            self.startFrame = 0;
                        }
                        times++;
                        return;
                    }else if(repeat == times && end){
                        self.stop();
                        self.startFrame = 0;
                        onComplete();
                        return;
                    }

                }

                onUpdate(self.startFrame,times);

                self.ctx.clearRect(0,0,self.width,self.height);
                self.ctx.drawImage(self.imgObj[self.startFrame], 0, 0,self.width,self.height);

                if(yoyo){
                    if(times%2 == 0){self.startFrame--}else{self.startFrame++}
                }else{
                    self.startFrame++;
                }

            },this.frameRate);
        },
        goto : function (id) {
            var _this = this;
            _this.startFrame = id;
            _this.ctx.clearRect(0,0,_this.width,_this.height);
            _this.ctx.drawImage(_this.imgObj[id], 0, 0,_this.width,_this.height);
        },
        playAndStop : function (settings) {

        },
        gotoAndStop : function (settings) {

        },
        stop : function () {
            clearInterval(this.process);
        }
    }
}();