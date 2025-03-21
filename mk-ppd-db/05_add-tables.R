#!/usr/local/bin/Rscript --vanilla


# ------------------------------ #
rm(list=ls())

options(echo=TRUE)
options(width=80)
options(warn=2)
options(scipen=10)
options(datatable.prettyprint.char=50)
options(datatable.print.class=TRUE)
options(datatable.print.keys=TRUE)
options(datatable.fwrite.sep='\t')
options(datatable.na.strings="")
options(mc.cores = parallel::detectCores())
# rstan_options(auto_write = TRUE)

args <- commandArgs(trailingOnly=TRUE)

library(colorout)
library(data.table)
library(magrittr)
library(stringr)
library(libbib)
library(RSQLite)

# ------------------------------ #

library(DBI)


INPUT_TABLES_LOCATION  <- "target/datafiles/tsv"
INPUT_TABLES_EXT       <- ".tsv.gz"
LIMITS_OUTPUT_LOCATION <- "target/limits"
DB_LOCATION            <- "target/ppddb/ppd.db"
CON                    <- dbConnect(RSQLite::SQLite(), DB_LOCATION)

ROWID_LIMITS          <- data.table(tableName=c(),
                                    primaryKey=c(),
                                    min=c(),
                                    max=c(),
                                    numRows=c())

getTableName <- function(fn) {
  str_replace(basename(fn), INPUT_TABLES_EXT, "")
}

addLimitsToList <- function(dat, tableName) {
  #  HACK  always assuming that the primary key is the first column
  pkeyName <- names(dat)[1]
  pkeyVec  <- dat[!is.na(1), 1]
  themin   <- pkeyVec %>% min
  themax   <- pkeyVec %>% max
  numRows  <- dat[, .N]
  ROWID_LIMITS <<- ROWID_LIMITS %>% rbind(data.table(tableName=tableName,
                                                     primaryKey=pkeyName,
                                                     min=themin,
                                                     max=themax,
                                                     numRows=numRows))
  print(ROWID_LIMITS)
}

addFileToDB <- function(fn) {
  tableName <- getTableName(fn)
  dat <- fread(fn, sep="\t", quote="")
  #  TODO  fix
  # the culprit is Object_ID=414609
  dat <- dat[!duplicated(dat[,1])]
  addLimitsToList(dat, tableName)
  dbAppendTable(CON, tableName, dat)
}


sprintf("%s/*.tsv.gz", INPUT_TABLES_LOCATION) %>%
  Sys.glob %>%
  sapply(addFileToDB)

dbDisconnect(CON)

ROWID_LIMITS %>% fwrite(sprintf("%s/primary-key-limits.tsv", LIMITS_OUTPUT_LOCATION),
                        sep="\t")

