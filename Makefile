#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#

#
# Copyright (c) 2018, Joyent, Inc. and assert-plus authors
#

NPM = npm

JS_FILES	:= $(shell find assert.js tests/ -name '*.js')

JSL_CONF	 = tools/jsl.node.conf
JSSTYLE_FLAGS	 = -f tools/jsstyle.conf

JSL_EXEC	?= deps/javascriptlint/build/install/jsl
JSSTYLE_EXEC	?= deps/jsstyle/jsstyle
JSL		?= $(JSL_EXEC)
JSSTYLE		?= $(JSSTYLE_EXEC)

.PHONY: install
install:
	$(NPM) install

.PHONY: clean
clean:
	rm -rf node_modules coverage

.PHONY: test
test: install
	npm test

.PHONY: check
check: $(JSL_EXEC) $(JSSTYLE_EXEC)
	$(JSL) --conf $(JSL_CONF) $(JS_FILES)
	$(JSSTYLE) $(JSSTYLE_FLAGS) $(JS_FILES)

.PHONY: prepush
prepush: check test


$(JSL_EXEC): | deps/javascriptlint/.git
	cd deps/javascriptlint && make install

$(JSSTYLE_EXEC): | deps/jsstyle/.git

.SECONDARY: $($(wildcard deps/*):%=%/.git)

deps/%/.git:
	git submodule update --init deps/$*
