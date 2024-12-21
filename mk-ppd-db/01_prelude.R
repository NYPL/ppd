#!/usr/local/bin/Rscript --vanilla

# ------------------------------ #
rm(list=ls())

options(echo=TRUE)
# options(width=80)
options(width=150)
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

# ------------------------------ #

LOC_OUT_TSV  = "./target/datafiles/tsv"
LOC_OUT_JSON = "./target/datafiles/json"

# ------------------------------ #

TMS_TABLES_LOCATION <- Sys.getenv("TMS_TABLES_LOCATION")

if (TMS_TABLES_LOCATION == "")
  stop("Location of TMS MSSQL table dumps must be provided by environment variable TMS_TABLES_LOCATION")

# ------------------------------ #

read.table.dump <- function(table.name) {
  path <- sprintf("%s/%s.txt", TMS_TABLES_LOCATION, table.name)
  return(fread(path, quote="", na.strings=c("NULL", "", "NA", NA))[])
}

separate_words_with_hyphens <- function(string) {
  string %>% str_detect("([a-z])([A-Z])")
  string %>% str_replace_all("([a-z])([A-Z])", "\\1_\\2")
}

write.derived.tsv <- function(DT, file.name) {
  fwrite(DT, file.name, sep="\t")
}

write.derived.json <- function(DT, file.name) {
  jdat <- jsonlite::toJSON(DT, na="null", pretty=TRUE)
  writeLines(jdat, file.name)
}

write.derived.files <- function(DT, table.name) {
  DT %>% write.derived.tsv(sprintf("%s/%s.tsv.gz",      LOC_OUT_TSV,  table.name))
  DT %>% write.derived.json(sprintf("%s/%s.data.json",  LOC_OUT_JSON, table.name))
}


# --------------------------------------------------------------- #

