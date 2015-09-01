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
var bucket = IS.bucket('NodeJS SDK Example', 'YOUR_ACCESS_KEY_GOES_HERE');

// Push event to initial state
bucket.push('Demo State', 'active');

setTimeout(function () {

	// Push another event
	bucket.push('Demo State', 'inactive');

}, 1000);
```

## API

#### IS.bucket(id, accessKey)

Open a bucket for event data. ...wat?

* *id* – A bucket key. This key cannot contain the colon (:) character.
* *accessKey* – An Initial State account access key. If this value is not defined, the `process.env.IS_API_ACCESS_KEY` will be used.

### bucket.push(key, value[, date])

Push a new event to a bucket. ...wat?

* *key* – The event key.
* *value* – The event value.
* *date* – The time of the event. A `Date` object or numeric timestamp (milliseconds since epoch). High-precision timestamps (i.e., sub-ms) can be declared as a string (e.g., '1420070400.000000001'), but must be in unix time (seconds since epoch). If not defined, a high-precision timestamp will be generated.
