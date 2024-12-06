TMS_TABLES_LOCATION := ~/data/tms-mssql-tables
OH1_SCRIPT_DIR 		:= 01_make-each-table/

TABLES   := $(basename $(notdir  $(wildcard $(OH1_SCRIPT_DIR)/*.R)))
OH1_DEPS := $(addsuffix .R,      $(addprefix 01_make-each-table/, $(TABLES)))
OH1_OUT1 := $(addsuffix .tsv.gz, $(addprefix target/datafiles/,   $(TABLES)))
OH1_OUT2 := $(addsuffix .tsv,    $(addprefix target/datatypes/,   $(TABLES)))
OH2_OUT1 := $(addsuffix .json,   $(addprefix target/json/, 	      $(TABLES)))
OH2_OUT2 := $(addsuffix .sql,    $(addprefix target/schemas/,     $(TABLES)))

FINAL_ARTIFACTS := target/ppddb/proto-column-definitions.ts target/ppddb/record-types.d.ts target/ppddb/db-constants.ts

AUTOGEN_WARNING := "// THIS IS AUTOMATICALLY GENERATED. DO NOT EDIT."


vpath %.R   	$(OH1_SCRIPT_DIR)
vpath %.tsv.gz  target/datafiles
vpath %.tsv 	target/datatypes
vpath %.json 	target/json
vpath %.sql 	target/schema


.PHONY: all
all: begin step01 step02 step03 step04 step05 done


# ----------------------------------------------------------------- #
# --- step 01 ----------------------------------------------------- #
.PHONY: step01
step01: $(OH1_OUT1) $(OH1_OUT2)

$(OH1_OUT1): target/datafiles/%.tsv.gz: %.R
	@ echo [*] building data table: `basename $@ .tsv.gz`
	@ TMS_TABLES_LOCATION=$(TMS_TABLES_LOCATION) ./$< > /dev/null

$(OH1_OUT2): $(OH1_OUT1)
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- step 02 ----------------------------------------------------- #
.PHONY: step02
step01: $(OH2_OUT1) $(OH2_OUT2) 02_create-schemas.mjs

$(OH2_OUT1): target/json/%.json: %.tsv.gz 02_create-schemas.mjs
	@ echo [*] building schema: `basename $@ .json`
	@ ./02_create-schemas.mjs `basename $@ .json`

$(OH2_OUT2): $(OH2_OUT1)
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- step 03 ----------------------------------------------------- #
.PHONY: step03
step03: target/ppddb/schema.sql

target/ppddb/schema.sql: $(OH2_OUT2) ./03_indexes.sql
	@ echo [*] concatenating sub-schemas
	@ echo "PRAGMA foreign_keys=ON;" > $@
	@ echo "BEGIN TRANSACTION;" >> $@
	@ cat $^ >> $@
	@ echo "COMMIT;" >> $@
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- step 04 ----------------------------------------------------- #
.PHONY: step04
step04: target/ppddb/ppd.db target/limits/primary-key-limits.tsv

target/ppddb/ppd.db: target/ppddb/schema.sql $(OH1_OUT1) 04_add-tables.R
	@ echo [*] creating ppd.db with concated schema
	@ rm -f $@
	@ sqlite3 $@ < $<
	@ echo [*] adding all datafiles as tables in ppd.db
	# @ ./04_add-tables.R > /dev/null
	@ ./04_add-tables.R
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- step 05 ----------------------------------------------------- #
.PHONY: step05
step05: $(FINAL_ARTIFACTS)

$(FINAL_ARTIFACTS): $(OH2_OUT1) 05_create-final-artifacts.mjs
	@ echo [*] building final artifacts
	@ ./05_create-final-artifacts.mjs
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- install, misc ----------------------------------------------- #
RECORD_TYPES_SOURCE_LOC  := target/ppddb/record-types.d.ts
RECORD_TYPES_INSTALL_LOC := ../types/record-types.d.ts
COLDEFS_SOURCE_LOC       := target/ppddb/proto-column-definitions.ts
COLDEFS_INSTALL_LOC 	 := ../lib/proto-column-definitions.ts
DB_SOURCE_LOC  			 := target/ppddb/ppd.db
DB_INSTALL_LOC 			 := ../db/ppd.db
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
# --- pushdb ------------------------------------------------------ #
S3_DEV_LOC 				 := s3://ppd-dev-db/
S3_PROD_LOC 			 := s3://ppd-production-db/

.PHONY: pushdb
pushdb:
	@ echo [*] Pushing DB to dev
	@ aws s3 cp $(DB_SOURCE_LOC) $(S3_DEV_LOC)
	@ echo [*]  TODO  STILL NEED ACCESS TO DEV
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- misc ------------------------------------------------------ #
.PHONY: debug
debug:
	@ echo tables  $(TABLES)
	@ echo oh1out1 $(OH1_OUT1)
	@ echo oh1out2 $(OH1_OUT2)
	@ echo oh2out1 $(OH2_OUT1)
	@ echo oh2out2 $(OH2_OUT2)

.PHONY: clean
clean:
	@ rm -rf target

.PHONY: begin
begin:
	@ echo "$$(tput bold)$$(tput setaf 3)Building PPD data substrate$$(tput sgr0)"
	@ printf '\n'
	@ mkdir -p target/datafiles target/datatypes target/json target/schemas target/ppddb target/limits

.PHONY: done
done:
	@ printf '\n'
	@ echo "$$(tput bold)$$(tput setaf 2)[•] Build done!$$(tput sgr0)"
# ----------------------------------------------------------------- #

