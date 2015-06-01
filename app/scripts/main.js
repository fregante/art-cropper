'use strict';
var onDrop = require('drag-and-drop-files');
var cutil = require('./_modules/canvas-utils.js');
var fillCanvas = require('./_modules/canvas-draw-image-fill.js');
var getImage = require('./_modules/image-loader.js');
var saveAs = require('./_modules/save-file.js').saveAs;
var select = require('./_modules/dom-select.js');
var pica = require('pica');

var dragging = false;
var ondragend = function () {};
document.documentElement.onmouseup = function () {
	dragging = false;
	if (ondragend) {
		ondragend();
		ondragend = null;
	}
};

function draw (ctx, image, opts) {
	var t = fillCanvas.getTransforms(ctx, image, opts);

	var width = image.width * t.scale;
	var height = image.height * t.scale;
	var scratch = cutil.getCanvas(width, height).el;
	pica.resizeCanvas(cutil.getCanvasFromImage(image), scratch, {
		quality: 3
	}, function () {
		ctx.drawImage(scratch,
			t.in.x * t.scale,
			t.in.y * t.scale,
			t.in.w * t.scale,
			t.in.h * t.scale,
			t.out.x,
			t.out.y,
			t.out.w,
			t.out.h
		);
	});
}
var lastEvent;
function createInteractiveCanvas (image, width, height, name) {
	var canvas = cutil.getCanvas(width, height);
	draw(canvas.ctx, image);

	select.byId('images').appendChild(canvas.el);

	var deltaX = 0;
	var deltaY = 0;
	canvas.el.onmousedown = function () {
		// deltaX = 0;
		// deltaY = 0;
		dragging = true;
	};
	canvas.el.onmousemove = function (e) {
		if (!dragging) {
			return;
		}
		if (lastEvent) {
			deltaX += e.screenX - lastEvent.screenX;
			deltaY += e.screenY - lastEvent.screenY;
		}
		lastEvent = e;
		fillCanvas(canvas.ctx, image, {
			offsetX: deltaX,
			offsetY: deltaY,
		});

		ondragend = function () {
			lastEvent = null;
			draw(canvas.ctx, image, {
				offsetX: deltaX,
				offsetY: deltaY,
			});
		};
	};
	canvas.el.__name = name;
	return canvas;
}
var counter = select.byId('counter');
var configEl = select.byId('config');
onDrop(document.documentElement, function (files) {
	var config = configEl.value.split(';').map(function (current) {
		current = current.split(',');
		var size = current[0].split('x');
		return {
			width: size[0],
			height: size[1],
			filename: current[1]
		};
	});

	files.forEach(function (file) {
		getImage(URL.createObjectURL(file), function () {
			var file = this;
			config.forEach(function (image) {
				createInteractiveCanvas(file, image.width, image.height, image.filename.replace(/#/g, counter.value));
			});
			counter.value = +counter.value + 1;
		}, true);
	});
});

window.onload = function () {
	select.byId('save').onclick = function () {
		select.all('canvas').forEach(function (canvas) {
			canvas.toBlob(function(blob) {
				saveAs(blob, canvas.__name + '.png');
			});
		});
	};
	select.byId('reset').onclick = function () {
		select.all('canvas').forEach(function (canvas) {
			canvas.parentNode.removeChild(canvas);
		});
	};
};

