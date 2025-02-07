
DB_SOURCE_LOC 			 := ppd.db
S3_DEV_LOC 				 := s3://ppd-dev-db/
S3_PROD_LOC 			 := s3://ppd-production-db/

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

.PHONY: pushdb
pushdb:
	aws s3 cp $(DB_SOURCE_LOC) $(S3_DEV_LOC)
