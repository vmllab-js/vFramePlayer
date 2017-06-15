# FramePlayer
序列帧图片播放插件，支持通过Canvas播放，可控制播放速度，可循环播放，甚至倒序播放。
## 如何使用
引入JS核心文件
```html
<script type="text/javascript" src="vframeplayer-min.js"></script>
 ```
在页面中插入DIV标签
```html
<div id="framePlayer"></div>
 ```
实例化vFramePlayer
```JS
<script type="text/javascript">
    //将所有图片放入一个数组
    var imgArr = ["img/0.jpg","img/1.jpg","img/2.jpg"];
    //实例化vFramePlayer
    var framePlayer = new vFramePlayer({
        dom : document.getElementById("framePlayer"),
        imgArr : imgArr
    });
</script>
```
## 参数
你可以用以下参数配置插件
* `dom` - 用于存放图片和CANVAS的DOM节点，该项必选
* `imgArr` - 图片序列数组，该项必选
* `fps` - 设置动画播放每秒显示帧频，该项可选。默认值：`25`
* `useCanvas` - 是否用CANVAS播放动画，该项可选，如果设置为`false`，则使用IMG播放。默认值：`true`
* `loop` - 循环播放次数，该项可选，不设置则不循环
* `yoyo` - yoyo球效果，配合`loop`使用，该项可选，如果设置为`true`，循环播放的时候会回播，默认值：`false`