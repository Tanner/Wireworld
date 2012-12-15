function init() {
	fitCanvasToWindow();

	$(window).bind("resize", fitCanvasToWindow);
}

function fitCanvasToWindow() {
	$("#screen").css("width", window.innerWidth + "px");
	$("#screen").css("height", window.innerHeight + "px");
}