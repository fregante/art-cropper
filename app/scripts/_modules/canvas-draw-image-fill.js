'use strict';
import getMediaSize from './get-media-size';
import getFillSize from './get-fill-size';

function parsePercentage (percentage) {
	return parseFloat(percentage, 10)/100;
}
export function findFocusPoint (fill, x = '50%', y = '50%') {
	let focus = {};
	focus.x = parsePercentage(x);
	focus.y = parsePercentage(y);

	focus.x = -fill.difference.width * focus.x;
	focus.y = -fill.difference.height * focus.y;

	return focus;
}
export default function drawImageFillArea (ctx, source, opts = {}) {
	let offset;
	let area = getMediaSize(ctx);
	let content = getMediaSize(source);
	let fill = getFillSize(area, content, opts.cover);

	if (opts.offset) {
		// pixel offset has priority
		offset = opts.offset;
	} else {
		// if not set, default to center of image
		if (!opts.focus) {
			opts.focus = {};
			opts.focus.x = '50%';
			opts.focus.y = '50%';
		}
		offset = findFocusPoint(fill, opts.focus.x, opts.focus.y);
	}

	ctx.drawImage(source,
		offset.x,
		offset.y,
		fill.width,
		fill.height,
		0,
		0,
		area.width,
		area.height
	);
}
