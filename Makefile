NODE_OPTS =
TEST_OPTS =

love:
	@echo "Feel like makin' love."

test:
	@node $(NODE_OPTS) ./node_modules/.bin/_mocha -R dot $(TEST_OPTS)

spec:
	@node $(NODE_OPTS) ./node_modules/.bin/_mocha -R spec $(TEST_OPTS)

autotest:
	@node $(NODE_OPTS) ./node_modules/.bin/_mocha -R dot --watch $(TEST_OPTS)

autospec:
	@node $(NODE_OPTS) ./node_modules/.bin/_mocha -R spec --watch $(TEST_OPTS)

pack:
	@file=$$(npm pack); echo "$$file"; tar tf "$$file"

constants:
	@node -e '\
		var ERRORS = require("./"); \
		for (var name in ERRORS) console.log("`%d` | `%s`", ERRORS[name], name) \
	'

codes.json: .FORCE
	node -e 'console.log(JSON.stringify(require("./codes"), null, "\t"))' > "$@"

publish:
	npm publish

tag:
	git tag "v$$(node -e 'console.log(require("./package").version)')"

clean:
	rm -f *.tgz
	npm prune --production

.PHONY: love
.PHONY: test spec autotest autospec
.PHONY: pack publish tag
.PHONY: clean
.PHONY: .FORCE
