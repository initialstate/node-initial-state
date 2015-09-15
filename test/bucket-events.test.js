'use strict';

var does = require('mocha'),
	mockery = require('mockery'),
	assert = require('chai').assert;


does.describe('Events', function () {

	var bucket,
		now;

	// Set Up

	does.before(function () {

		mockery.enable({
			warnOnReplace: true,
			warnOnUnregistered: true,
			useCleanCache: true
		});

		mockery.registerAllowable('../bucket');
		mockery.registerAllowable('events');
		mockery.registerAllowable('./clock.mock');
		mockery.registerSubstitute('./epoch-clock', './test/clock.mock');
		mockery.registerSubstitute('./https-request', './test/https-request.mock');

		now = require('./clock.mock').now();

	});

	does.beforeEach(function (done) {

		var isBucket = require('../bucket');

		bucket = isBucket('valid-id', 'valid-key')
			.once('ready', function () {
				bucket.removeListener('error', done);
				done();
			})
			.on('error', done);

	});

	// Tear Down

	does.afterEach(function () {

		if (bucket) {
			bucket.removeAllListeners();
		}

	});

	does.after(function () {
		mockery.deregisterAll();
		mockery.disable();
	});

	// Tests

	does.it('push an event', function (done) {

		var count = 0;

		bucket.push('event-type', 'event-value', now);

		bucket.once('data', function (events) {
				assert.isArray(events);
				assert.strictEqual(events[0].key, 'event-type', 'Event has expected "key"');
				assert.strictEqual(events[0].value, 'event-value', 'Event has expected "value"');
				assert.strictEqual(events[0].epoch, now, 'Event has expected "epoch"');

				count += events.length;
			})
			.once('drain', function () {
				assert.strictEqual(count, 1, 'One event was sent');
				done();
			})
			.once('error', done);

	});

	does.it('send multiple events at once', function (done) {

		var count = 0,
			values = ['A','B','C','D','E','F','G','H','I','J'];

		values.forEach(function (value) {
			bucket.push('event-type', value, now);
		});

		bucket.once('data', function (events) {
				assert.isArray(events);
				assert.sameMembers(events.map(function (event) {
					return event.value;
				}), values, 'Events in order');

				count += events.length;
			})
			.once('drain', function () {
				assert.strictEqual(count, values.length, values.length + ' events were sent');
				done();
			})
			.once('error', done);

	});

	does.it('auto-generate timestamp', function (done) {

		var count = 0;
		bucket.push('event-type', 'event-value');
		bucket.once('data', function (events) {
				assert.isArray(events);
				assert.strictEqual(events[0].epoch, now, 'Event has expected "epoch"');
				count += events.length;
			})
			.once('drain', function () {
				assert.strictEqual(count, 1, 'One event was sent');
				done();
			})
			.once('error', done);

	});

	does.it('handles API overflow');

	does.it('handles API error');

	does.it('buffers when offline');

	does.it('buffers until bucket exists');

	does.it('flushes on process exit');


});
