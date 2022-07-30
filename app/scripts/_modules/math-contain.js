'use strict';
export default function contain (x, min, max) {
	return Math.max(min, Math.min(max, x));
}
