
all: build

.PHONY: data
build: clean data
	npm run build
	cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

.PHONY: clean
clean:
	rm -rf .next

.PHONY: dev
dev:
	npm run dev

.PHONY: start
start:
	npm run startstandalone

.PHONY: data
data: db/tms-mii.db

db/tms-mii.db:
	aws s3 cp s3://miscellaneous-ri0ohsh7/tms-mii.db $@
