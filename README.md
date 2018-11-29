# Initial State
The Initial State SDK for NodeJS.

[![Build Status](https://travis-ci.org/initialstate/node-initial-state.svg)](https://travis-ci.org/initialstate/node-initial-state)

## Installation

```sh
npm install initial-state
```

## Example Use

```javascript
var IS = require('initial-state');
var bucket = IS.bucket('BUCKET_KEY', 'YOUR_ACCESS_KEY_GOES_HERE');

// Push a count every second
var count = 0;
setTimeout(function () {

	// Push another event
	bucket.push('Demo Count', ++count);

}, 1000);
```

## API

#### IS.bucket(id, accessKey)

Create an event data bucket.

* *id* – A bucket key. This key should contain only alphanumeric and underscore characters. If the bucket does not yet exist, this value will be used as the bucket name.
* *accessKey* – An Initial State account access key. This argument is not needed if the access key is assigned to the environmental variable `IS_API_ACCESS_KEY`.

To declare different a bucket key and name, use the object override parameter:

```javascript
var bucket = IS.bucket({
	name: 'My Bucket',
	id: 'BUCKET_KEY',
	accessKey: 'YOUR_ACCESS_KEY_GOES_HERE'
});
```

### bucket.push(key, value[, date])

Send event data to Initial State.

* *key* – The event key.
* *value* – The event value.
* *date* – The time of the event. A `Date` object or numeric timestamp (milliseconds since epoch). High-precision timestamps (i.e., sub-ms) can be declared as a string (e.g., `'1420070400.000000001'`), but must be in unix time (seconds since epoch). If not defined, a high-precision timestamp will be generated.
