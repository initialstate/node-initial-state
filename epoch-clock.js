'use strict';

function EpochClock() {
	if (!(this instanceof EpochClock)) {
		return new EpochClock();
	}
	this.epoch = Date.now();
	this.start = process.hrtime();
}

EpochClock.prototype.now = function () {
	// get unix timestamp (seconds since epoch) with high-precision
	var elapsed = process.hrtime(this.start),
		ms = elapsed[1] / 1e6,
		subms = ms % 1;
	return ((this.epoch + ms - subms) / 1e3 + elapsed[0]).toFixed(3) + subms.toFixed(6).slice(2);
};

module.exports = EpochClock;
