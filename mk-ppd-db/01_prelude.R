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

TMS_TABLES_LOCATION <- Sys.getenv("TMS_TABLES_LOCATION")

if (TMS_TABLES_LOCATION == "")
  stop("Location of TMS MSSQL table dumps must be provided by environment variable TMS_TABLES_LOCATION")

# ------------------------------ #

read.table.dump <- function(table.name) {
  path <- sprintf("%s/%s.txt", TMS_TABLES_LOCATION, table.name)
  return(fread(path, quote="", na.strings=c("NULL", ""))[])
}

makeDataTypesDT <- function(dat) {
  dat %>% lapply(class) -> tmp
  data.table(colName=names(tmp), datatype=unlist(tmp), otherArgs=NA_character_)[]
}

separate_words_with_hyphens <- function(string) {
  string %>% str_detect("([a-z])([A-Z])")
  string %>% str_replace_all("([a-z])([A-Z])", "\\1_\\2")
}

# --------------------------------------------------------------- #

