'use strict';

var does = require('mocha'),
	mockery = require('mockery'),
	assert = require('chai').assert;


does.describe('Buckets', function () {

	var isBucket;

	// Set Up

	does.before(function () {

		mockery.enable({
			warnOnReplace: true,
			warnOnUnregistered: true,
			useCleanCache: true
		});

		mockery.registerAllowable('../bucket');
		mockery.registerAllowable('events');
		mockery.registerAllowable('./epoch-clock');
		mockery.registerSubstitute('./https-request', './test/https-request.mock');

		isBucket = require('../bucket');
	});

	// Tear Down

	does.after(function () {
		mockery.deregisterAll();
		mockery.disable();
	});

	// Tests

	does.it('creates a new bucket', function (done) {

		var newId = 'new-id',
			bucket = isBucket(newId, 'valid-key');

		assert.instanceOf(bucket, isBucket.Bucket, 'create a local bucket');
		assert.strictEqual(bucket.id, newId, 'bucket ID matches constructor argument');
		assert.strictEqual(bucket.name, newId, 'Used the bucket ID when a bucket name is not available');

		bucket.once('ready', function (isNew) {
				assert.strictEqual(isNew, true, 'created a new remote bucket');
				done();
			})
			.once('error', done);

	});

	does.it('set name of a new bucket', function (done) {

		var newId = 'new-id',
			newName = 'new-name',
			bucket = isBucket({ id: newId, name: newName }, 'valid-key');

		assert.strictEqual(bucket.id, newId, 'bucket ID matches constructor argument');
		assert.strictEqual(bucket.name, newName, 'bucket name matches constructor argument');

		bucket.once('ready', function (isNew) {
				assert.strictEqual(isNew, true, 'created a new remote bucket');
				done();
			})
			.once('error', done);

	});

	does.it('use to an existing a bucket', function (done) {

		isBucket('existing-id', 'valid-key')
			.once('ready', function (isNew) {
				assert.strictEqual(isNew, false, 'used an existing bucket');
				done();
			})
			.once('error', done);

	});

	does.it('use access key from "IS_API_ACCESS_KEY" env var', function (done) {

		process.env.IS_API_ACCESS_KEY = 'env-var-key';

		function cleanUp(err) {
			delete process.env.IS_API_ACCESS_KEY;
			done(err);
		}

		isBucket('existing-id')
			.once('ready', function () {
				// without an env var key, an Unauthenticated error should occur
				cleanUp(null);
			})
			.once('error', cleanUp);

	});

	does.it('handles missing access key', function (done) {

		isBucket('existing-id')
			.once('ready', function () {
				done(new Error('Failure Expected'));
			})
			.once('error', function (err) {
				assert.ok(err, 'error provided');
				assert.strictEqual(err.message, 'Unauthorized', 'Unauthorized error message');
				done();
			});

	});

	does.it('handles invalid access key', function (done) {

		isBucket('existing-id', 'invalid-key')
			.once('ready', function () {
				done(new Error('Failure Expected'));
			})
			.once('error', function (err) {
				assert.ok(err, 'error provided');
				assert.strictEqual(err.message, 'Unauthorized', 'Expected unauthorized error');
				done();
			});

	});

	does.it('handles api error', function (done) {

		isBucket('existing-id', 'error-key')
			.once('ready', function () {
				done(new Error('Failure Expected'));
			})
			.once('error', function (err) {
				assert.ok(err, 'error provided');
				assert.strictEqual(err.message, 'API Response Status 503', 'Expected unauthorized error');
				done();
			});

	});

});
