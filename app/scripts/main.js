'use strict';
var onDrop = require('drag-and-drop-files');
var cutil = require('./_modules/canvas-utils.js');
import fillCanvas from './_modules/canvas-draw-image-fill.js';
import getImage from './_modules/image-loader.js';
import getFillSize from './_modules/get-fill-size';
import getMediaSize from './_modules/get-media-size.js';
import containBetween from './_modules/math-contain.js';
window.getFillSize = getFillSize;
window.getMediaSize = getMediaSize;
var saveAs = require('./_modules/save-file.js').saveAs;
var select = require('./_modules/dom-select.js');
var pica = require('pica');

function draw (ctx, source, opts) {
	let area = getMediaSize(ctx);
	let content = getMediaSize(source);
	let fill = getFillSize(area, content);
	var width = source.width * fill.scale;
	var height = source.height * fill.scale;

	var qualityResizedImage = cutil.getCanvas(width, height).el;
	pica.resizeCanvas(cutil.getCanvasFromImage(source), qualityResizedImage, {
		quality: 3
	}, function () {
		fillCanvas(ctx, qualityResizedImage, opts);
	});
}
var lastEvent;
function createInteractiveCanvas (source, width, height, name) {
	var canvas = cutil.getCanvas(width, height);
	let area = getMediaSize(canvas.ctx);
	let content = getMediaSize(source);
	let fill = getFillSize(area, content);
	draw(canvas.ctx, source);

	select.byId('images').appendChild(canvas.el);

	var offsetX = -fill.difference.width / 2;
	var offsetY = -fill.difference.height / 2;
	var opts;
	function mousemove (e) {
		if (lastEvent) {
			offsetX -= e.screenX - lastEvent.screenX;
			offsetY -= e.screenY - lastEvent.screenY;
		}
		offsetX = containBetween(offsetX, 0, -fill.difference.width);
		offsetY = containBetween(offsetY, 0, -fill.difference.height);
		lastEvent = e;
		opts = {
			offset: {
				x: offsetX,
				y: offsetY,
			}
		};
		fillCanvas(canvas.ctx, source, opts);
	}
	function mouseup () {
		lastEvent = null;
		draw(canvas.ctx, source, opts);
		window.removeEventListener('mousemove', mousemove);
		window.removeEventListener('mouseup', mouseup);
	}
	function mousedown () {
		window.addEventListener('mousemove', mousemove);
		window.addEventListener('mouseup', mouseup);
	}
	canvas.el.onmousedown = mousedown;
	canvas.el.__name = name;
	return canvas;
}

var counter = select.byId('counter');
var configEl = select.byId('config');
onDrop(document.documentElement, function (files) {
	if(!configEl.value) {
		console.warn('using default config');
		configEl.value = '200x200,video-thumb';
	}
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
		getImage(URL.createObjectURL(file)).then(function (file) {
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

