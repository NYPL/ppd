
all: build

.PHONY: build
build: clean
	npm run build
	cp -r public .next/standalone/
	cp -r .next/static .next/standalone/.next/

.PHONY: clean
clean:
	rm -rf .next

.PHONY: dev
dev:
	npm run dev

.PHONY: start
start:
	npm run startstandalone

