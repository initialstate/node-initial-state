# Initial State
The Initial State SDK for NodeJS.

[![Build Status](https://travis-ci.org/InitialState/node-initial-state.svg)](https://travis-ci.org/InitialState/node-initial-state)

## Installation

```
npm install initial-state
```

## Example Use

```
var IS = require('initial-state');

var bucket = IS.bucket({
	bucketKey: 'NodeJS SDK Example',
	accessKey: 'YOUR_ACCESS_KEY_GOES_HERE'
});

// Push event to initial state
bucket.push('Demo Running', true);

setTimeout(function () {

	bucket.push({
		key:'Demo Running',
		value: false,
		epoch: Date.now()
	});

}, 1000);
```

## API

#### IS.bucket(options)

Open a bucket for event data. ...wat?

* *options.accessKey* – An Initial State account access key
* *options.bucketKey* – A bucket Key (may not use)
* *options.bucketName* – A human-readable name for the bucket. Note: This only works when creating 

### bucket.write(key, value[, date])

Create and write an event.

* *key* – 
* *value* – 
* *date* – A timestamp for when the event occured

### bucket.write(event)

Write an event.


### event.key

The event key.

### event.value

The event value.

### event.epoch

A `Date` or unix timestamp (seconds since 1970 UTC). High-precision timestamps (i.e., sub-ms) can be declared as a string (e.g., '1420070400.000000001') or in hrtime format. If not defined, the Initial State API will use the request time.
