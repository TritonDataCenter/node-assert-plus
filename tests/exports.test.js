var assert = require('assert');
var assertPlus = require('../');

assert.equal(typeof (assertPlus), 'function');
assertPlus(true);

// ensure all exports on "assert" exist on "assert-plus"
Object.keys(assert).forEach(function (key) {
	assert(assertPlus[key], 'missing exported property ' + key);
});
