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

// Pass this if window is not defined yet
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

	if (typeof define === "function" && define.amd) {
		define("frameplayer", [], function () {
			return frameplayer;
		});
	} else {
		window.frameplayer = frameplayer;
	}

	return frameplayer;
});