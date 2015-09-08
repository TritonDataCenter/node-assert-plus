var assert = require('assert');

var test = require('tape');

var assertPlus = require('../');

test('exports', function (t) {
	t.equal(typeof (assertPlus), 'function');

	t.doesNotThrow(function () {
		assertPlus(true);
	}, 'assertPlus(true)');

	t.throws(function () {
		assertPlus(false);
	}, 'assertPlus(false)');

	// ensure all exports on "assert" exist on "assert-plus"
	Object.keys(assert).forEach(function (key) {
		t.ok(assertPlus[key], 'missing exported property ' + key);
	});

	t.end();
});
