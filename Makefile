EMBER_ENV ?= development
PREFIX ?= /usr/local
SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

all: clean lib dist

.PHONY: clean all test deps

clean:
	@rm -rf $(LIB) tmp dist public/articles/*.json public/pages/*.json public/pages.json public/articles.json

node_modules:
	npm install

bower_components:
	bower install

bundle: $(PREFIX)/bin/bower $(PREFIX)/bin/babel $(PREFIX)/bin/ember node_modules bower_components

$(PREFIX)/bin/bower:
	@npm install -g bower

$(PREFIX)/bin/babel:
	@npm install -g babel

$(PREFIX)/bin/ember:
	@npm install -g ember-cli

lib: bundle $(LIB)
lib/%.js: src/%.js
	@mkdir -p $(@D)
	babel $< -o $@

dist: bundle lib
	ember build --environment=$(EMBER_ENV)

test: bundle lib
	ember test

watch: bundle lib
	ember server
