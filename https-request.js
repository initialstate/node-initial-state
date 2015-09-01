'use strict';

var https = require('https');

module.exports = function request(config, data, done) {
	https.request(config, function (res) {
		var err = null,
			status = res.statusCode;

		// TODO: handle 429 responses
		if (status === 401) {
			err = new Error('Unauthorized');
		} else if (status < 200 || status >= 300) {
			err = new Error('API Response Status ' + status);
		}
		done(err, status);
	})
	.on('error', done)
	.end(JSON.stringify(data));
};
