
.DELETE_ON_ERROR:

#  TODO  YOU _HAVE_ TO MAKE VERBOSE MODE!!!

TMS_TABLES_LOCATION 	:= ~/data/tms-mssql-tables
STEP01_SCRIPT_DIR 		:= 01_make-each-table/

TABLES   					:= $(basename $(notdir  	$(wildcard $(STEP01_SCRIPT_DIR)/*.R)))
JSCHEMAS 					:= $(wildcard ./json-schemas/*.schema.json)
STEP01_OUT_DATAFILES_TSVS 	:= $(addsuffix .tsv.gz, 	$(addprefix target/datafiles/tsv/, $(TABLES)))
STEP01_OUT_DATAFILES_JSON 	:= $(addsuffix .data.json, 	$(addprefix target/datafiles/json/, $(TABLES)))
STEP02_OUT_TYPEDEFS		 	:= $(addsuffix .d.ts,   	$(addprefix target/typedefs/, $(TABLES)))

AUTOGEN_WARNING := "// THIS IS AUTOMATICALLY GENERATED. DO NOT EDIT."


vpath %.R   			$(STEP01_SCRIPT_DIR)
vpath %.schema.json 	json-schemas
vpath %.tsv.gz  		target/datafiles/tsv
vpath %.data.json  		target/datafiles/json


.PHONY: all
all: begin step01 step02 step03 step04 step05 step06 done


# ----------------------------------------------------------------- #
#' # step 01
#'   making the datafiles from the raw data (both tsvs and json)
#'
.PHONY: step01
step01: $(STEP01_OUT_DATAFILES_TSVS) $(STEP01_OUT_DATAFILES_JSON)

target/datafiles/tsv/%.tsv.gz target/datafiles/json/%.json: %.R 01_prelude.R
	@ echo [*] building data table: `basename $@ .tsv.gz`
	@ TMS_TABLES_LOCATION=$(TMS_TABLES_LOCATION) ./$< > /dev/null
# ----------------------------------------------------------------- #



# ----------------------------------------------------------------- #
#' # step 02
#'   - validate the data against the json schemas
#'   - write out the typescript type definitions
#'
.PHONY: step02
step02: $(STEP02_OUT_TYPEDEFS)

target/typedefs/%.d.ts: %.schema.json %.data.json scripts/validate-in.ts
	@ echo [*] Validating data: $*
	@ bun ./scripts/validate-in.ts $^ > /dev/null
	@ echo [*] Writing type definitions
	@ npx json2ts $< | tail -n +6 | perl -pe 's@^(  /..)$$@\n$$1@g' | perl -pe 's/^export/declare/' | tail -n +2 > $@
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
#' # step 03
#'   writing sqlite schema
#'
.PHONY: step03
step03: target/sqlschema/schema.sql target/sqlschema/indexes.sql target/sqlschema/full-text.sql

target/sqlschema/schema.sql target/sqlschema/indexes.sql target/sqlschema/full-text.sql: $(JSCHEMAS) scripts/make-sqlite-schema.ts scripts/make-fttables-sql.ts
	@ echo [*] Writing sqlite schema
	@ bun ./scripts/make-sqlite-schema.ts json-schemas/
	@ echo [*] Writing full-text sql file
	@ bun ./scripts/make-fttables-sql.ts json-schemas/main.schema.json
# ----------------------------------------------------------------- #

# ----------------------------------------------------------------- #
#' # step 04
#'   combining type defs into `record-types.d.ts`
#'
.PHONY: step04
step04: target/ppddb/record-types.d.ts

target/ppddb/record-types.d.ts: $(STEP02_OUT_TYPEDEFS)
	@ echo [*] Creating final/concatenated typedef file
	@ echo '' > $@
	@ ls 01_make-each-table/* | perl -pe 's@.+/(\w+).R@"$$1"@' | tr '\n' ' ' | perl -pe 's/ / | /g' | perl -pe 's/\s+.\s+$$/;\n/g' | perl -pe 's/^/type TableName= /' >> $@
	@ cat $^ >> $@
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
#' # step 05
#'   creates ppd.db and the limits file
#'
.PHONY: step05
step05: target/ppddb/ppd.db target/limits/primary-key-limits.tsv

target/ppddb/ppd.db target/limits/primary-key-limits.tsv: target/sqlschema/schema.sql $(STEP01_OUT_DATAFILES_TSVS) target/sqlschema/indexes.sql 05_add-tables.R
	@ echo [*] creating ppd.db with concated schema
	@ rm -f target/ppddb/ppd.db
	@ sqlite3 target/ppddb/ppd.db < target/sqlschema/schema.sql
	@ echo [*] adding all datafiles as tables in ppd.db
	@ ./05_add-tables.R > /dev/null
	@ echo [*] adding indexes
	@ sqlite3 target/ppddb/ppd.db < target/sqlschema/indexes.sql
	@ echo [*] adding ft tables
	@ sqlite3 target/ppddb/ppd.db < target/sqlschema/full-text.sql
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
#' # step 06
#'   outputs final artifacts (proto-column-definitions.ts and db-constants.ts)
#'
.PHONY: step06
step06: target/ppddb/db-constants.ts target/ppddb/proto-column-definitions.ts

target/ppddb/db-constants.ts target/ppddb/proto-column-definitions.ts: 06_create-final-artifacts.mjs
	@ echo [*] creating final artifacts
	@ ./06_create-final-artifacts.mjs

# ----------------------------------------------------------------- #



# ----------------------------------------------------------------- #
#' # install
#'   copy artifacts into project root
#'
RECORD_TYPES_SOURCE_LOC  := target/ppddb/record-types.d.ts
RECORD_TYPES_INSTALL_LOC := ../types/record-types.d.ts
COLDEFS_SOURCE_LOC       := target/ppddb/proto-column-definitions.ts
COLDEFS_INSTALL_LOC 	 := ../lib/proto-column-definitions.ts
DB_SOURCE_LOC  			 := target/ppddb/ppd.db
DB_INSTALL_LOC 			 := ../ppd.db
DB_CONSTANTS_SOURCE_LOC  := target/ppddb/db-constants.ts
DB_CONSTANTS_INSTALL_LOC := ../lib/db-constants.ts

.PHONY: install
install:
	@ echo [*] Installing record-types.d.ts
	@ echo $(AUTOGEN_WARNING) > $(RECORD_TYPES_INSTALL_LOC)
	@ cat $(RECORD_TYPES_SOURCE_LOC) >> $(RECORD_TYPES_INSTALL_LOC)
	@ echo [*] Installing proto-column-definitions.ts
	@ echo $(AUTOGEN_WARNING) > $(COLDEFS_INSTALL_LOC)
	@ echo "" >> $(COLDEFS_INSTALL_LOC)
	@ cat $(COLDEFS_SOURCE_LOC) >> $(COLDEFS_INSTALL_LOC)
	@ echo [*] Installing db-constants.ts
	@ echo $(AUTOGEN_WARNING) > $(DB_CONSTANTS_INSTALL_LOC)
	@ echo "" >> $(DB_CONSTANTS_INSTALL_LOC)
	@ cat $(DB_CONSTANTS_SOURCE_LOC) >> $(DB_CONSTANTS_INSTALL_LOC)
	@ echo [*] Installing new db
	@ cp $(DB_SOURCE_LOC) $(DB_INSTALL_LOC)
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
#' # pushdb
#'   pushes DB to dev bucket
#'
S3_DEV_LOC 				 := s3://ppd-dev-db/

.PHONY: pushdb
pushdb:
	@ echo [*] Pushing DB to dev
	@ aws s3 cp $(DB_SOURCE_LOC) $(S3_DEV_LOC)
	@ echo [*] NOW SYNC PROD
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
#' # debug
#'   show chosen internal variables
#'
.PHONY: debug
debug:
	@ echo $(JSCHEMAS)
# ----------------------------------------------------------------- #

# ----------------------------------------------------------------- #
#' # clean
#'   clear target directory
#'
.PHONY: clean
clean:
	@ rm -rf target
# ----------------------------------------------------------------- #

# ----------------------------------------------------------------- #
#' # begin
#'   create necessary folders in the target directory
#'
.PHONY: begin
begin:
	@ echo "$$(tput bold)$$(tput setaf 3)Building PPD data substrate$$(tput sgr0)"
	@ printf '\n'
	@ mkdir -p target/datafiles/tsv target/datafiles/json target/typedefs target/ppddb target/sqlschema target/limits
# ----------------------------------------------------------------- #

# ----------------------------------------------------------------- #
#' # done
#'   alerts the user that all steps have been completed
#'
.PHONY: done
done:
	@ printf '\n'
	@ echo "$$(tput bold)$$(tput setaf 2)[•] Build done!$$(tput sgr0)"
# ----------------------------------------------------------------- #

# ----------------------------------------------------------------- #
# ----------------------------------------------------------------- #
#' # help
#'   print this help message
#'
.PHONY: help
help:
	@ cat Makefile | egrep "#' " | perl -pe 's/^...//' | perl -pe 's/#/\n/g'
# ----------------------------------------------------------------- #
