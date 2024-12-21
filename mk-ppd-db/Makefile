
.DELETE_ON_ERROR:

#  TODO  YOU _HAVE_ TO MAKE VERBOSE MODE!!!

#  TODO  compress *.data.json

TMS_TABLES_LOCATION 	:= ~/data/tms-mssql-tables
STEP01_SCRIPT_DIR 		:= 01_make-each-table/

TABLES   					:= $(basename $(notdir  	$(wildcard $(STEP01_SCRIPT_DIR)/*.R)))
STEP01_OUT_DATAFILES_TSVS 	:= $(addsuffix .tsv.gz, 	$(addprefix target/datafiles/tsv/, $(TABLES)))
STEP01_OUT_DATAFILES_JSON 	:= $(addsuffix .data.json, 	$(addprefix target/datafiles/json/, $(TABLES)))
STEP02_OUT_TYPEDEFS		 	:= $(addsuffix .d.ts,   	$(addprefix target/typedefs/, $(TABLES)))
# OH1_OUT2 := $(addsuffix .tsv,    $(addprefix target/datatypes/,   $(TABLES)))
# OH2_OUT1 := $(addsuffix .json,   $(addprefix target/json/, 	      $(TABLES)))
# OH2_OUT2 := $(addsuffix .sql,    $(addprefix target/schemas/,     $(TABLES)))

# FINAL_ARTIFACTS := target/ppddb/proto-column-definitions.ts target/ppddb/record-types.d.ts target/ppddb/db-constants.ts

AUTOGEN_WARNING := "// THIS IS AUTOMATICALLY GENERATED. DO NOT EDIT."


vpath %.R   			$(STEP01_SCRIPT_DIR)
vpath %.schema.json 	json-schemas
vpath %.tsv.gz  		target/datafiles/tsv
vpath %.data.json  		target/datafiles/json
# vpath %.tsv 			target/datatypes
# vpath %.json 			target/json
# vpath %.sql 			target/schema


.PHONY: all
all: begin step01 step02


# ----------------------------------------------------------------- #
# --- step 01 
# ---   making the datafiles from the raw data
# ---   (both tsvs and json)
# ----------------------------------------------------------------- #

.PHONY: step01
step01: $(STEP01_OUT_DATAFILES_TSVS) $(STEP01_OUT_DATAFILES_JSON)

target/datafiles/tsv/%.tsv.gz target/datafiles/json/%.json: %.R
	@ echo [*] building data table: `basename $@ .tsv.gz`
	@ TMS_TABLES_LOCATION=$(TMS_TABLES_LOCATION) ./$< > /dev/null

# ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- step 02 
# ---   a) validating that the data from 
# ---   (both tsvs and json)
# ----------------------------------------------------------------- #

.PHONY: step02
step02: $(STEP02_OUT_TYPEDEFS)

target/typedefs/%.d.ts: %.schema.json %.data.json
	@ echo [*] Validating data: $*
	@ ./scripts/validate-in.ts $^ > /dev/null
	@ echo [*] Writing type definitions
	@ npx json2ts $< | perl -pe 's@^(  /..)$$@\n$$1@g' | perl -pe 's/^export/declare/' | tail -n +2 > $@

# ----------------------------------------------------------------- #




#
# # ----------------------------------------------------------------- #
# # --- install, misc ----------------------------------------------- #
# RECORD_TYPES_SOURCE_LOC  := target/ppddb/record-types.d.ts
# RECORD_TYPES_INSTALL_LOC := ../types/record-types.d.ts
# COLDEFS_SOURCE_LOC       := target/ppddb/proto-column-definitions.ts
# COLDEFS_INSTALL_LOC 	 := ../lib/proto-column-definitions.ts
# DB_SOURCE_LOC  			 := target/ppddb/ppd.db
# DB_INSTALL_LOC 			 := ../ppd.db
# DB_CONSTANTS_SOURCE_LOC  := target/ppddb/db-constants.ts
# DB_CONSTANTS_INSTALL_LOC := ../lib/db-constants.ts
#
# .PHONY: install
# install:
# 	@ echo [*] Installing record-types.d.ts
# 	@ echo $(AUTOGEN_WARNING) > $(RECORD_TYPES_INSTALL_LOC)
# 	@ cat $(RECORD_TYPES_SOURCE_LOC) >> $(RECORD_TYPES_INSTALL_LOC)
# 	@ echo [*] Installing proto-column-definitions.ts
# 	@ echo $(AUTOGEN_WARNING) > $(COLDEFS_INSTALL_LOC)
# 	@ echo "" >> $(COLDEFS_INSTALL_LOC)
# 	@ cat $(COLDEFS_SOURCE_LOC) >> $(COLDEFS_INSTALL_LOC)
# 	@ echo [*] Installing db-constants.ts
# 	@ echo $(AUTOGEN_WARNING) > $(DB_CONSTANTS_INSTALL_LOC)
# 	@ echo "" >> $(DB_CONSTANTS_INSTALL_LOC)
# 	@ cat $(DB_CONSTANTS_SOURCE_LOC) >> $(DB_CONSTANTS_INSTALL_LOC)
# 	@ echo [*] Installing new db
# 	@ cp $(DB_SOURCE_LOC) $(DB_INSTALL_LOC)
# # ----------------------------------------------------------------- #
#
#
# # ----------------------------------------------------------------- #
# # --- pushdb ------------------------------------------------------ #
# S3_DEV_LOC 				 := s3://ppd-dev-db/
# S3_PROD_LOC 			 := s3://ppd-production-db/
#
# .PHONY: pushdb
# pushdb:
# 	@ echo [*] Pushing DB to dev
# 	@ aws s3 cp $(DB_SOURCE_LOC) $(S3_DEV_LOC)
# 	@ echo [*]  TODO  STILL NEED ACCESS TO DEV
# # ----------------------------------------------------------------- #


# ----------------------------------------------------------------- #
# --- misc ------------------------------------------------------ #
.PHONY: debug
debug:
	@ echo tables  $(TABLES)

.PHONY: clean
clean:
	@ rm -rf target

.PHONY: begin
begin:
	@ echo "$$(tput bold)$$(tput setaf 3)Building PPD data substrate$$(tput sgr0)"
	@ printf '\n'
	@ mkdir -p target/datafiles/tsv target/datafiles/json target/typedefs

.PHONY: done
done:
	@ printf '\n'
	@ echo "$$(tput bold)$$(tput setaf 2)[•] Build done!$$(tput sgr0)"
# ----------------------------------------------------------------- #

