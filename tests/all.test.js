var f = require('util').format;
var stream = require('stream');

var test = require('tape');

var assertPlus = require('../');


function capitalize(s) {
	return s[0].toUpperCase() + s.substr(1);
}

/**
 * Example JavaScript objects and primitives to test.  The keys of this object
 * will match the methods exported by the assert-plus module.
 *
 * The idea is to check all "valid" examples against their respective methods
 * and ensure hey do NOT throw, and also check all "invalid" examples
 * against the same method and ensure that they DO throw.
 */
var examples = {
	bool: {
		valid: [
			false,
			true
		],
		invalid: [
			-1,
			0,
			Infinity,
			NaN,
			'foo',
			'00000000-0000-0000-0000-000000000000',
			/regex/,
			[],
			{},
			new Date(),
			new Buffer(0),
			new stream(),
			function () {}
		]
	},
	buffer: {
		valid: [
			new Buffer(0),
			new Buffer('foo')
		],
		invalid: [
			false,
			true,
			-1,
			0,
			Infinity,
			NaN,
			'foo',
			'00000000-0000-0000-0000-000000000000',
			/regex/,
			[],
			{},
			new Date(),
			new stream(),
			function () {}
		]
	},
	date: {
		valid: [
			new Date(),
			new Date(0)
		],
		invalid: [
			false,
			true,
			-1,
			0,
			Infinity,
			NaN,
			'foo',
			'00000000-0000-0000-0000-000000000000',
			/regex/,
			[],
			{},
			new Buffer(0),
			new stream(),
			function () {}
		]
	},
	func: {
		valid: [
			function () {},
			console.log
		],
		invalid: [
			false,
			true,
			-1,
			0,
			Infinity,
			NaN,
			'foo',
			'00000000-0000-0000-0000-000000000000',
			/regex/,
			[],
			{},
			new Date(),
			new Buffer(0),
			new stream()
		]
	},
	number: {
		valid: [
			-1,
			0,
			1,
			0.5,
			Math.PI
		],
		invalid: [
			false,
			true,
			Infinity,
			NaN,
			'foo',
			'00000000-0000-0000-0000-000000000000',
			/regex/,
			[],
			{},
			new Date(),
			new Buffer(0),
			new stream(),
			function () {}
		]
	},
	object: {
		valid: [
			{},
			console
		],
		invalid: [
			false,
			true,
			-1,
			0,
			Infinity,
			NaN,
			'foo',
			'00000000-0000-0000-0000-000000000000',
			/regex/
		]
	},
	regexp: {
		valid: [
			/foo/,
			new RegExp('foo')
		],
		invalid: [
			false,
			true,
			-1,
			0,
			Infinity,
			NaN,
			'foo',
			'00000000-0000-0000-0000-000000000000',
			[],
			{},
			new Date(),
			new Buffer(0),
			new stream(),
			function () {},
		]
	},
	stream: {
		valid: [
			new stream(),
			process.stdout
		],
		invalid: [
			false,
			true,
			-1,
			0,
			Infinity,
			NaN,
			'foo',
			'00000000-0000-0000-0000-000000000000',
			/regex/,
			[],
			{},
			new Date(),
			new Buffer(0),
			function () {},
		]
	},
	string: {
		valid: [
			'foo',
			'bar',
			'baz'
		],
		invalid: [
			false,
			true,
			-1,
			0,
			Infinity,
			NaN,
			/regex/,
			[],
			{},
			new Date(),
			new Buffer(0),
			new stream(),
			function () {},
		]
	},
	uuid: {
		valid: [
			'B3A4A7B5-11C3-449B-B46F-86C57AA99022',
			'76d26c04-d351-42b7-bba9-c130169cc162'
		],
		invalid: [
			false,
			true,
			-1,
			0,
			Infinity,
			NaN,
			'foo',
			/regex/,
			[],
			{},
			new Date(),
			new Buffer(0),
			new stream(),
			function () {},
		]
	}
};

test('can continue', function (t) {
	if (process.env.NODE_NDEBUG)
		t.fail('NODE_NDEBUG must be unset for this test to work!');
	t.end();
});

// loop each example type
// ie: "func", "bool", "string", etc.
Object.keys(examples).forEach(function (type) {
	var capType = capitalize(type);

	test(f('testing type "%s" (valid)', type), function (t) {
		var validArray = examples[type].valid;

		// test each individual member of the array explicitly
		validArray.forEach(function (o) {
			t.doesNotThrow(function () {
				assertPlus[type](o);
			}, f('%s(%s) should succeed', type, o));

			t.doesNotThrow(function () {
				assertPlus['optional' + capType](o);
			}, f('optional%s(%s) should succeed', capType, o));

			t.doesNotThrow(function () {
				assertPlus['optional' + capType](undefined);
			}, f('optional%s(%s) should succeed', capType, 'undefined'));
		});

		// test the entire array with arrayOf* and optionalArrayOf*
		t.doesNotThrow(function () {
			assertPlus['arrayOf' + capType](validArray);
		}, f('arrayOf%s(%s) should succeed', capType, validArray));

		t.doesNotThrow(function () {
			assertPlus['optionalArrayOf' + capType](validArray);
		}, f('optionalArrayOf%s(%s) should succeed', capType, validArray));

		t.doesNotThrow(function () {
			assertPlus['optionalArrayOf' + capType](undefined);
		}, f('optionalArrayOf%s(%s should succeed)', capType, 'undefined'));

		t.end();
	});

	test(f('testing type "%s" (invalid)', type), function (t) {
		var invalidArray = examples[type].invalid;

		// test each individual member of the array explicitly
		invalidArray.forEach(function (o) {
			t.throws(function () {
				assertPlus[type](o);
			}, f('%s(%s) should throw', type, o));

			t.throws(function () {
				assertPlus['optional' + capType](o);
			}, f('optional%s(%s) should throw', capType, o));
		});

		// test the entire array with arrayOf* and optionalArrayOf*
		t.throws(function () {
			assertPlus['arrayOf' + capType](invalidArray);
		}, f('arrayOf%s(%s) should throw', capType, invalidArray));

		t.throws(function () {
			assertPlus['optionalArrayOf' + capType](invalidArray);
		}, f('optionalArrayOf%s(%s) should throw', capType, invalidArray));

		t.end();
	});
});
