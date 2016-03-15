all: build

build:
	npm run build

clean:
	rm -rf dist
	rm -rf data
	mkdir -p dist
	mkdir -p data

test:
	npm test

simpletest:
	npm run simpletest

.PHONY: build clean test simpletest
