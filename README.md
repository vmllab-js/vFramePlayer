# FramePlayer
序列帧图片播放插件，支持通过Canvas播放，可控制播放速度，可循环播放，甚至倒序播放。
## 初始化
```html
<div class="box">
     <div class="framePlayer"></div>
     <div class="control">
         <i class="fa fa-play"></i>
         <i class="fa fa-pause"></i>
         <i class="fa fa-backward"></i>
         <i class="fa fa-stop"></i>
         <i class="fa fa-forward"></i>
         <div class="process_bar">
             <div class="process"></div>
         </div>
     </div>
     <div class="info">
         <div class="curFrame">当前帧：<span></span></div>
         <div class="times">循环次数：<span></span></div>
         <div class="asc">正序：<span></span></div>
         <div class="fps">FPS：<span></span></div>
     </div>
 </div>
 ```
