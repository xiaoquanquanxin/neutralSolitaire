var App = (function (win) {
	var app = {};
	app.mobileResize = mobileResize;
	app.isMobile = isMobile;
	app.isLandscape = isLandscape;

	//  移动端字号
	function mobileResize() {
		document.documentElement.style.fontSize = Math.min(win.innerWidth, 960) / 10 + 'px';
	}

	//  是移动端
	function isMobile() {
		return !!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|wins Phone)/i));
	}

	//  是横屏
	function isLandscape() {
		return !(win.orientation % 180);
	}

	win.forEach = Array.prototype.forEach;
	win.map = Array.prototype.map;
	win.reduce= Array.prototype.reduce;
	return function () {
		return app;
	};
}(window));
