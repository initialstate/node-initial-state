'use strict';

var epoch = Date.now(),
	start = process.hrtime();

function now() {
	// get unix timestamp (seconds since epoch) with high-precision
	var elapsed = process.hrtime(start),
		ms = elapsed[1] / 1e6,
		subms = ms % 1;
	return ((epoch + ms - subms) / 1e3 + elapsed[0]).toFixed(3) + subms.toFixed(6).slice(2);
}
exports.now = now;

function toTimestamp(value) {
	if (typeof value === 'string') {
		if (isFinite(+value)) {
			// Accept pre-defined
			return value;
		}
		value = Date.parse(value);
	}
	if (typeof value === 'number' && isFinite(value)) {
		// ms -> sec
		return (value / 1000).toString();
	}
	if (typeof value === 'undefined') {
		return now();
	}
	return void 0;
}
exports.toTimestamp = toTimestamp;
