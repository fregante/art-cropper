'use strict';
export default function getMediaSize (media, scale = 1) {
	let size;
	if (!media) {
		console.warn('Missing media!');
		size = {
			width: 0,
			height: 0,
		};
	}
	if (media.canvas) { // it's a ctx
		media = media.canvas;
	}
	if (media.getContext) { // it's a canvas
		size = {
			width: media.width,
			height: media.height,
		};
	} else { // image or video
		size = {
			width: media.naturalWidth || media.videoWidth || 0,
			height: media.naturalHeight || media.videoHeight || 0,
		};
	}

	size.width /= scale;
	size.height /= scale;

	if (!size.width || !size.height) {
		console.warn('Media has no size');
	}
	return size;
}
