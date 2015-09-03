'use strict';

// Mock Triggers & Response Status

// Access Keys:
// 	invalid-key — 401
// 	error-key — 503

// Bucket IDs:
// 	new-id — 201
// 	invalid:id — 401
// 	overload-id — 429

function initBucketStatus(config, data) {
	var id = data && data.bucketKey;
	return (id === 'invalid:id') ? 400 :
			(id === 'overload-id') ? 429 :
			(id === 'new-id') ? 201 : 200;
}

function postEventsStatus(config, data) {
	var id = config.headers && config.headers['X-IS-AccessKey'];
	return (id === 'invalid:id') ? 401 :
			(id === 'overload-id') ? 429 :
			Array.isArray(data) ? 200 : 400;
}

module.exports = function mockHttpsRequest(config, data, done) {
	var key = config && config.headers && config.headers['X-IS-AccessKey'],
		status = (!data) ? 400:
			(key === 'invalid-key' || !key) ? 401:
			(key === 'error-key') ? 503:
			data.bucketKey ?
				initBucketStatus(config, data, done):
				postEventsStatus(config, data, done),
		err = (status === 401) ? new Error('Unauthorized'):
				(status < 200 || status >= 300) ? new Error('API Response Status ' + status): null;

	process.nextTick(function () {
		done(err, status);
	});

};
