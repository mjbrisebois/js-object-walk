#
# Project
#
package-lock.json:	package.json
	npm install
	touch $@
node_modules:		package-lock.json
	npm install
	touch $@
build:			node_modules lib/index.js

lib/index.js:           src/*.ts Makefile
	rm -rf lib
	npx tsc -t es2022 -m es2022 --moduleResolution node --esModuleInterop   \
		--strictNullChecks                                              \
		--outDir lib -d --sourceMap src/index.ts


#
# Testing
#
MOCHA_OPTS		= --no-warnings --enable-source-maps

test:			test-unit

test-unit:		build
	npx mocha $(MOCHA_OPTS) tests/unit/test_*.js


#
# Repository
#
clean-remove-chaff:
	@find . -name '*~' -exec rm {} \;
clean-files:		clean-remove-chaff
	git clean -nd
clean-files-force:	clean-remove-chaff
	git clean -fd
clean-files-all:	clean-remove-chaff
	git clean -ndx
clean-files-all-force:	clean-remove-chaff
	git clean -fdx


#
# NPM
#
preview-package:	clean-files test
	npm pack --dry-run .
create-package:		clean-files test
	npm pack .
publish-package:	clean-files test
	npm publish --access public .
