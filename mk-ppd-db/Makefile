TMS_TABLES_LOCATION := ~/data/tms-mssql-tables
OH1_SCRIPT_DIR 		:= 01_make-each-table/

TABLES   := $(basename $(notdir  $(wildcard $(OH1_SCRIPT_DIR)/*.R)))
OH1_DEPS := $(addsuffix .R,      $(addprefix 01_make-each-table/, $(TABLES)))
OH1_OUT1 := $(addsuffix .tsv.gz, $(addprefix target/datafiles/,   $(TABLES)))
OH1_OUT2 := $(addsuffix .tsv,    $(addprefix target/datatypes/,   $(TABLES)))
OH2_OUT1 := $(addsuffix .json,   $(addprefix target/json/, 	      $(TABLES)))
OH2_OUT2 := $(addsuffix .sql,    $(addprefix target/schemas/,     $(TABLES)))


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
step04: target/ppddb/ppd.db

target/ppddb/ppd.db: target/ppddb/schema.sql $(OH1_OUT1) 04_add-tables.R
	@ echo [*] creating ppd.db with concated schema
	@ rm -f $@
	@ sqlite3 $@ < $<
	@ echo [*] adding all datafiles as tables in ppd.db
	@ ./04_add-tables.R > /dev/null
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- step 05 ----------------------------------------------------- #
LAST_ARTIFACTS := target/ppddb/proto-column-definitions.ts target/ppddb/record-types.d.ts

.PHONY: step05
step05: $(LAST_ARTIFACTS)

$(LAST_ARTIFACTS): $(OH2_OUT1)
	@ echo [*] building final artifacts
	@ ./05_create-interfaces-and-column-defs.mjs
# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- install, misc ----------------------------------------------- #
.PHONY: install
install:
	@ echo TODO
	@ echo INCLUDE
	@ echo - target/ppddb/ppd.db
	@ echo - - push or mv?
	@ echo - target/ppddb/proto-column-definitions.ts
	@ echo - - and code change in app
	@ echo - ./target/ppddb/record-types.d.ts

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
	@ mkdir -p target/datafiles target/datatypes target/json target/schemas target/ppddb

.PHONY: done
done:
	@ printf '\n'
	@ echo "$$(tput bold)$$(tput setaf 2)[•] Build done!$$(tput sgr0)"
# ----------------------------------------------------------------- #

