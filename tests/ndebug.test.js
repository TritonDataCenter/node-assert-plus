// Copyright 2015 Joyent, Inc.

var assert = require('assert');
var test = require('tape');


///--- Globals

var regularExport;
var ndebugExport;


///--- Tests

test('simulated import', function (t) {
    t.ifError(process.env.NODE_NDEBUG, 'run with NDEBUG off');

    regularExport = require('../');
    t.ok(regularExport);

    /* fake setting NODE_NDEBUG */
    ndebugExport = regularExport._setExports(true);
    t.end();
});

test('assertions suppressed via ndebug', function (t) {
    t.throws(function () {
        regularExport.fail('fail!');
    });

    t.doesNotThrow(function () {
        ndebugExport.fail('fail!');
    });
    t.end();
});
