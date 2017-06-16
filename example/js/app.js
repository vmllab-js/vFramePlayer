/**
 * Created by lipei on 2017/6/14.
 */
var loadImages = function (Parameter) {
	var sources = Parameter.loadArr;
	var loadingPercent = "";
	var count = 0;
	var images = {};
	var imgNum = sources.length;
	for (var src in sources) {
		var path = src;
		images[path] = new Image();
		images[path].onload = function () {
			count++;
			if (count >= imgNum) {
				Parameter.complete(images);
			}
		};
		images[path].onerror = function () {
			count++;
			if (count >= imgNum) {
				Parameter.complete(images);
			}
		};
		images[path].src = sources[path];
	}
};

$(document).ready(function () {
	var info = $(".info");
	var process = $(".process");
	var settings = $(".settings");

	var framePlayer;

	var imgArr = [];
	for (var i = 0; i < 151; i++) {
		imgArr.push("image/" + i + ".jpg");
	}

	loadImages({
		loadArr: imgArr,
		complete: function () {

			framePlayer = new vFramePlayer({
				dom: $(".framePlayer")[0],
				imgArr: imgArr,
				loop: 3,
				yoyo: true,
				useCanvas: true
			});

			framePlayer.goto(framePlayer.get("startFrame"));

			var default_set = function () {
				settings.find(".yoyo").attr("checked", framePlayer.get("yoyo"));
				settings.find(".times").val(framePlayer.get("loop"));
				settings.find(".fps").val(framePlayer.get("fps"));
				settings.find(".start").val(framePlayer.get("startFrame")).attr("max", imgArr.length - 1);
				settings.find(".end").val(framePlayer.get("endFrame")).attr("max", imgArr.length - 1);
				var mode_id = framePlayer.get("useCanvas") ? 0 : 1;
				settings.find(".mode[name='mode']").eq(mode_id).attr('checked', 'true');
			};

			default_set();

			framePlayer.on("play", function () {
				console.log("开始播放");
				$(".start").attr("disabled", true).addClass("disabled");
				$(".end").attr("disabled", true).addClass("disabled");
				default_set();
			});

			framePlayer.on("stop", function () {
				console.log("停止播放");
				$(".start").attr("disabled", false).removeClass("disabled");
				$(".end").attr("disabled", false).removeClass("disabled");
			});

			framePlayer.on("pause", function () {
				console.log("暂停播放");
			});

			framePlayer.on("update", function (frame, times, asc) {
//                  console.log(frame,times,asc);
				info.find(".curFrame").find("span").text(frame);
				info.find(".times").find("span").text(times);
				info.find(".asc").find("span").text(asc);
				info.find(".fps").find("span").text(framePlayer.get("fps"));

				var process_total = imgArr.length - 1;
				var a = 100 / process_total;
				process.css({"width": frame * a + "%"});
			});

//              framePlayer.set("fps",20);

			$(".fa-play").on("click", function () {
				var fps = settings.find(".fps").val();
				var yoyo = settings.find(".yoyo").is(':checked');
				var start = settings.find(".start").val();
				var end = settings.find(".end").val();
				var $selectedvalue = settings.find("input[name='mode']:checked").val();
				var useCanvas = $selectedvalue === "true";
				framePlayer.play(start, end, {
					"fps": fps, "yoyo": yoyo, "useCanvas": useCanvas, onComplete: function () {
//                      console.log("完成播放");
					}, onUpdate: function (frame, times, asc) {
//                      console.log(frame,times,asc);
					}
				});
			});

			$(".fa-pause").on("click", function () {
				framePlayer.pause();
			});

			$(".fa-stop").on("click", function () {
				framePlayer.stop();
			});

			$(".fa-backward").on("click", function () {
				var fps = framePlayer.get("fps");
				if (Math.round(fps / 1.5) > 0) {
					framePlayer.set("fps", Math.round(fps / 1.5));
				}
			});

			$(".fa-forward").on("click", function () {
				var fps = framePlayer.get("fps");
				if (Math.round(fps * 1.5) < 60) {
					framePlayer.set("fps", Math.round(fps * 1.5));
				}
			});

			$(".mode").on("change", function () {
				var $selectedvalue = $("input[name='mode']:checked").val();
				var useCanvas = $selectedvalue === "true";
				framePlayer.set("useCanvas", useCanvas);
			});

			$(".times").on("change", function () {
				var times = $(this).val();
				framePlayer.set("loop", times);
			});

			$(".start").on("change", function () {
				var start = $(this).val();
				framePlayer.set("startFrame", start);
			});

			$(".end").on("change", function () {
				var end = $(this).val();
				framePlayer.set("endFrame", end);
			});

			$(".fps").on("change", function () {
				var fps = $(this).val();
				framePlayer.set("fps", fps);
			});

			$(".yoyo").on("change", function () {
				var yoyo = $(this).is(':checked');
				framePlayer.set("yoyo", yoyo);
			});
		}
	});

});