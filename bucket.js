'use strict';

var request = require('./https-request');
var Clock = require('./epoch-clock');
var API_HOST = 'groker.initialstate.com';

function Bucket(name, id, accessKey) {
	if (!(this instanceof Bucket)) {
		return new Bucket(name, id, accessKey);
	}

	var clock = new Clock(),
		bucket = this,
		buffer = [],
		verified = false,
		sending = false,
		flushSymbol = null,
		bucketData = {
			bucketKey: id || name,
			bucketName: name || id
		},
		eventHttp = {
			hostname: process.env.IS_API_HOST || API_HOST,
			path: '/api/buckets',
			method: 'POST',
			keepAlive: true,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Accept-Version': '0.0.1',
				'X-IS-AccessKey': accessKey || process.env.IS_API_ACCESS_KEY
			}
		};

	bucket.name = bucketData.bucketName;
	bucket.id = bucketData.bucketKey;

	function pushEvent(event) {
		if (event) {
			buffer.push(event);
			flushSoon();
		}
	}

	function toEpoch(value) {
		if (typeof value === 'string') {
			if (isFinite(+value)) {
				// Accept pre-defined
				return value;
			}
			value = Date.parse(value);
		}
		if (typeof value === 'number') {
			// ms -> sec
			return (value / 1000).toString();
		}
		if (typeof value === 'undefined') {
			return clock.now();
		}
		return void 0;
	}

	this.push = function (key, value, date) {
		pushEvent({
			key: (typeof key === 'string') ? key : String(key),
			value: (typeof value === 'string') ? value : String(value),
			epoch: toEpoch(date)
		});
	};

	function sent(err) {
		sending = false;
		// events sent, ready to send more...
		if (err) {
			bucket.emit('error', err);
			return;
		}
		if (buffer.length > 0) {
			flushSoon();
		} else {
			bucket.emit('drain');
		}
	}

	function flush() {
		// send all events
		clearImmediate(flushSymbol);
		flushSymbol = null;
		var len = buffer.length;
		if (verified && len > 0) {
			sending = true;
			var events = buffer.splice(0, len);
			request(eventHttp, events, sent);
			bucket.emit('send', events);
		}
	}

	function flushSoon() {
		// queue new flush, only after flush has completed
		if (verified && !sending && flushSymbol == null) {
			flushSymbol = setImmediate(flush);
		}
	}

	// Create/verify bucket before sending data
	request(eventHttp, bucketData, function (err) {
		if (err) {
			bucket.emit('error', err);
			return;
		}

		// Switch to events endpoint
		eventHttp.path = '/api/events';
		eventHttp.headers['X-IS-BucketKey'] = bucketData.bucketKey;

		bucket.emit('ready', bucket);
		// bucket exists, start sending events
		verified = true;
		if (buffer.length > 0) {
			flushSoon();
		}
	});

}

Bucket.prototype = Object.create(require('events').EventEmitter.prototype, {
	constructor: { value: Bucket }
});

module.exports = function createBucket(name, id, accessKey) {
	if (arguments.length < 3) {
		// (id, accessKey) or (id)
		accessKey = id;
		id = name;
	}

	return new Bucket(name, id, accessKey);
};
