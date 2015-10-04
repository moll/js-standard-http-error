NODE = node
NODE_OPTS =
TEST_OPTS =

love:
	@echo "Feel like makin' love."

test:
	@$(NODE) $(NODE_OPTS) ./node_modules/.bin/_mocha -R dot $(TEST_OPTS)

spec:
	@$(NODE) $(NODE_OPTS) ./node_modules/.bin/_mocha -R spec $(TEST_OPTS)

autotest:
	@$(NODE) $(NODE_OPTS) ./node_modules/.bin/_mocha -R dot --watch $(TEST_OPTS)

autospec:
	@$(NODE) $(NODE_OPTS) ./node_modules/.bin/_mocha -R spec --watch $(TEST_OPTS)

pack:
	@file=$$(npm pack); echo "$$file"; tar tf "$$file"

constants:
	@$(NODE) -e '\
		var ERRORS = require("./"); \
		for (var name in ERRORS) console.log("`%d` | `%s`", ERRORS[name], name) \
	'

codes.json: .FORCE
	$(NODE) -e 'console.log(JSON.stringify(require("http").STATUS_CODES, null, "\t"))' > "$@"

publish:
	npm publish

tag:
	git tag "v$$($(NODE) -e 'console.log(require("./package").version)')"

clean:
	rm -f *.tgz
	npm prune --production

.PHONY: love
.PHONY: test spec autotest autospec
.PHONY: pack publish tag
.PHONY: clean
.PHONY: .FORCE
