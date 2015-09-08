process.env.NODE_NDEBUG = 1;

var f = require('util').format;

var test = require('tape');

var assertPlus = require('../');

test('ndebug', function (t) {
	// ensure all exports on "assert-plus" that are functions
	// result in nothing happening
	Object.keys(assertPlus).forEach(function (key) {
		if (key === 'AssertionError')
			return;

		// should not throw because NDEBUG
		[undefined, null, {}, [], 'foo', 0, NaN].forEach(function (o) {
			t.doesNotThrow(function() {
				assertPlus[key](o);
			}, f('assertPlus.%s(%s)', key, o));
		});
	});

	t.end();
});
