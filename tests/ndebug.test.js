process.env.NODE_NDEBUG = 1;

var assertPlus = require('../');

// ensure all exports on "assert-plus" that are functions
// result in nothing happening
Object.keys(assertPlus).forEach(function (key) {
	if (key === 'AssertionError')
		return;
	var f = assertPlus[key];

	// should not throw because NDEBUG
	f.call(assertPlus, undefined);
	f.call(assertPlus, null);
	f.call(assertPlus, {});
	f.call(assertPlus, []);
	f.call(assertPlus, 'foo');
});
