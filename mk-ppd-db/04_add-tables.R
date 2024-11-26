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


INPUT_TABLES_LOCATION <- "target/datafiles"
INPUT_TABLES_EXT      <- ".tsv.gz"
DB_LOCATION           <- "target/ppddb/ppd.db"
CON                   <- dbConnect(RSQLite::SQLite(), DB_LOCATION)

getTableName <- function(fn) {
  str_replace(basename(fn), INPUT_TABLES_EXT, "")
}

addFileToDB <- function(fn) {
  tableName <- getTableName(fn)
  dat <- fread(fn)
  #  TODO  this
  #  HACK  this
  # the culprit is Object_ID=414609
  dat <- dat[!duplicated(dat[,1])]
  dbAppendTable(CON, tableName, dat)
}

sprintf("%s/*.tsv.gz", INPUT_TABLES_LOCATION) %>%
  Sys.glob %>%
  sapply(addFileToDB)

dbDisconnect(CON)

