EMBER_ENV ?= development
PREFIX ?= /usr/local
SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

all: clean lib dist

.PHONY: clean all test deps

clean:
	@rm -rf $(LIB) tmp dist

node_modules:
	npm install

bower_components:
	bower install

bundle: $(PREFIX)/bin/npm $(PREFIX)/bin/bower node_modules bower_components

/usr/local/bin/bower:
	@npm install -g bower

/usr/local/bin/npm:
	$(error "Please install Node.js")

lib: bundle $(LIB)
lib/%.js: src/%.js
	@mkdir -p $(@D)
	node_modules/.bin/babel $< -o $@

dist: bundle
	ember build --environment=$(EMBER_ENV)

test: bundle lib
	ember test

watch: bundle lib
	ember server
