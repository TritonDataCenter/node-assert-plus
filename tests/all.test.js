/*
 * Copyright (c) 2018, Joyent, Inc. and assert-plus authors
 */

var f = require('util').format;
var stream = require('stream');
var test = require('tape');


///--- Globals

var assertPlus;


///--- Helpers

function capitalize(s) {
    return s[0].toUpperCase() + s.substr(1);
}


///--- Tests

/*
 * Example JavaScript objects and primitives to test.  The keys of this object
 * will match the methods exported by the assert-plus module.
 *
 * The idea is to check all "valid" examples against their respective methods
 * and ensure hey do NOT throw, and also check all "invalid" examples
 * against the same method and ensure that they DO throw.
 */
var examples = {
    array: {
        valid: [
            [],
            ['asdf']
        ],
        invalid: [
            false,
            true
            -1,
            0,
            Infinity,
            NaN,
            'foo',
            '00000000-0000-0000-0000-000000000000',
            /regex/,
            {},
            new Date(),
            new Buffer(0),
            new stream(),
            function () {}
        ]
    },
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
            Math.PI,
            Infinity
        ],
        invalid: [
            false,
            true,
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
    finite: {
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
            console,
            /regex/
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
            null
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
            function () {}
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
            function () {}
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
            function () {}
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
            function () {}
        ]
    }
};

test('test setup', function (t) {
    t.ifError(process.env.NODE_NDEBUG, 'run with NDEBUG off');
    assertPlus = require('../');
    t.ok(assertPlus);
    t.end();
});

Object.keys(examples).forEach(function (type) {
    var capType = capitalize(type);

    /* test normal */
    test(f('assert.%s', type), function (t) {
        var name = type;

        examples[type].valid.forEach(function (val) {
            t.doesNotThrow(function () {
                assertPlus[name](val);
            }, f('%s(%s) should succeed', name, val));
        });

        examples[type].invalid.forEach(function (val) {
            t.throws(function () {
                assertPlus[name](val);
            }, f('%s(%s) should throw', name, val));
        });

        t.end();
    });

    /* test optional */
    test(f('assert.%s (optional)', type), function (t) {
        var name = 'optional' + capType;

        examples[type].valid.forEach(function (val) {
            t.doesNotThrow(function () {
                assertPlus[name](val);
            }, f('%s(%s) should succeed', name, val));
        });
        t.doesNotThrow(function () {
            assertPlus[name](null);
        }, f('%s(%s) should succeed', name, null));
        t.doesNotThrow(function () {
            assertPlus[name](undefined);
        }, f('%s(%s) should succeed', name, undefined));

        examples[type].invalid.forEach(function (val) {
            /* null is valid for optional tests */
            if (val === null) {
                return;
            }
            t.throws(function () {
                assertPlus[name](val);
            }, f('%s(%s) should throw', name, val));
        });

        t.end();
    });

    /* test arrayOf */
    test(f('assert.%s (arrayOf)', type), function (t) {
        var name = 'arrayOf' + capType;
        var val = examples[type].valid;

        t.doesNotThrow(function () {
            assertPlus[name](val);
        }, f('%s(%s) should succeed', name, val));

        val = examples[type].invalid;
        t.throws(function () {
            assertPlus[name](val);
        }, f('%s(%s) should throw', type, val));

        t.end();
    });

    /* test optionalArrayOf */
    test(f('assert.%s (optionalArrayOf)', type), function (t) {
        var name = 'optionalArrayOf' + capType;
        var val = examples[type].valid;

        t.doesNotThrow(function () {
            assertPlus[name](val);
        }, f('%s(%s) should succeed', name, val));
        t.doesNotThrow(function () {
            assertPlus[name](null);
        }, f('%s(%s) should succeed', name, null));
        t.doesNotThrow(function () {
            assertPlus[name](undefined);
        }, f('%s(%s) should succeed', name, undefined));

        val = examples[type].invalid;
        t.throws(function () {
            assertPlus[name](val);
        }, f('%s(%s) should throw', type, val));

        t.end();
    });
});
