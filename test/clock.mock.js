'use strict';


function now() {
	return '1420070400.000000000';
}
exports.now = now;

function toTimestamp(value) {
	if (value != null && isFinite(+value) || typeof value === 'undefined') {
		return now();
	}
	return void 0;
}

exports.toTimestamp = toTimestamp;
