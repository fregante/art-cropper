'use strict';
function getTransforms (ctx, source, opts) {
	opts = opts || {};
	var x = opts.x || 0;
	var y = opts.y || 0;
	var w = opts.w || ctx.canvas.width;
	var h = opts.h || ctx.canvas.height;
	var offsetX = opts.offsetX || 0;
	var offsetY = opts.offsetY || 0;

	var origWidth = opts.origWidth || source.width || source.videoWidth;
	var origHeight = opts.origHeight || source.height || source.videoHeight;
	if(!origWidth || !origHeight) {
		console.log('Width or height not available', origWidth, origHeight);
	}
	if (ctx.__storedScale > 1) {
		w/= ctx.__storedScale;
		h/= ctx.__storedScale;
	}

	var scale;
	var sourceX = 0;
	var sourceY = 0;
	var sourceWidth = origWidth;
	var sourceHeight = origHeight;

	var sourceRatio = origHeight / origWidth;
	var destinationRatio = h / w;
	var isDestinationLandscape = h < w;


	var maxOffsetDeltaX = 0;
	var maxOffsetDeltaY = 0;

	if (sourceRatio < destinationRatio) {
		scale = h / sourceHeight;
		maxOffsetDeltaX = Math.abs(w - sourceWidth*scale);
		// if (isDestinationLandscape) {
			// sourceWidth = sourceHeight * destinationRatio;
		// } else {
			sourceWidth = sourceHeight / destinationRatio;
		// }
		sourceX = (origWidth - sourceWidth)/2;
	} else {
		scale = w / sourceWidth;
		maxOffsetDeltaY = Math.abs(h - sourceHeight*scale);
		if (isDestinationLandscape) {
			sourceHeight = sourceWidth * destinationRatio;
		} else {
			sourceHeight = sourceWidth / destinationRatio;
		}
		sourceY = (origHeight - sourceHeight)/2;
	}

	offsetX = Math.max(-maxOffsetDeltaX, Math.min(maxOffsetDeltaX, offsetX/scale));
	offsetY = Math.max(-maxOffsetDeltaY, Math.min(maxOffsetDeltaY, offsetY/scale));
	sourceX -= offsetX;
	sourceY -= offsetY;
	return {
		scale: scale,
		offset: {
			x: offsetX,
			y: offsetY
		},
		in: {
			x: sourceX,
			y: sourceY,
			w: sourceWidth,
			h: sourceHeight
		},
		out: {
			x: x,
			y: y,
			w: w,
			h: h
		}
	};
}
function drawImageFromTransforms (ctx, source, t) {
	ctx.drawImage(source,
		t.in.x,
		t.in.y,
		t.in.w,
		t.in.h,
		t.out.x,
		t.out.y,
		t.out.w,
		t.out.h
	);
}
function drawImageFillArea (ctx, source, opts) {
	drawImageFromTransforms(ctx, source, getTransforms(ctx, source, opts));
}

module.exports = drawImageFillArea;
module.exports.getTransforms = getTransforms;
module.exports.drawImageFromTransforms = drawImageFromTransforms;
