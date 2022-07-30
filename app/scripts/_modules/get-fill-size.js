'use strict';
export default function getFillSize (
	content = {width: 1, height: 1},
	area = {width: 1, height: 1},
	cover = true) {
	cover = !!cover;
	content.ratio = content.width / content.height;
	area.ratio = area.width / area.height;

	// figure out which dimension should touch
	// i.e. 16:9 `content` in square `area` touches `height` in `cover
	let dimension = {};
	if (cover === content.ratio < area.ratio) {
		dimension.touching = 'height';
		dimension.following = 'width';
	} else {
		dimension.touching = 'width';
		dimension.following = 'height';
	}

	let fill = {};
	fill.difference = {};

	// calculate scale
	fill.scale = area[dimension.touching] / content[dimension.touching];

	// set touching dimension
	fill[dimension.touching] = area[dimension.touching];
	fill.difference[dimension.touching] = 0;

	// set following dimension
	fill[dimension.following] = content[dimension.following] * fill.scale;
	fill.difference[dimension.following] = fill[dimension.following] - area[dimension.following];

	return fill;
}
