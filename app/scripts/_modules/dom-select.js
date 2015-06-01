'use strict';
var select = function (selector, container) {
	container = container || document;
	return container.querySelector(selector);
};
select.all = function (selector, container) {
	container = container || document;
	return Array.prototype.slice.call(container.querySelectorAll(selector));
};
select.byClass = function (className, container) {
	container = container || document;
	return Array.prototype.slice.call(container.getElementsByClassName(className));
};
select.byId = function (id, container) {
	container = container || document;
	return container.getElementById(id);
};
module.exports = select;
