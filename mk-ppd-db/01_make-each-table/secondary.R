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

# ------------------------------ #

OUTPUT_NAME <- "secondary"

TMS_TABLES_LOCATION <- Sys.getenv("TMS_TABLES_LOCATION")

if (TMS_TABLES_LOCATION == "")
  stop("Location of TMS MSSQL table dumps must be provided by environment variable TMS_TABLES_LOCATION")

# ------------------------------ #

read.table.dump <- function(table.name) {
  path <- sprintf("%s/%s.txt", TMS_TABLES_LOCATION, table.name)
  return(fread(path, quote="", na.strings=c("NULL", ""))[])
}

# --------------------------------------------------------------- #

options(width=180)

# --------------------------------------------------------------- #



mstobjs <- read.table.dump("Objects")
base <- mstobjs[, .(Object_ID=ObjectID)]


# --------------------------------------------------------------- #
# DEPARTMENTS --------------------------------------------------- #

objs <- mstobjs[, .(Object_ID=ObjectID, DepartmentID)]

departments <- read.table.dump("Departments")
departments <- departments[, .(DepartmentID, Department=Mnemonic)]
departments <- objs %>% merge(departments)

base %<>% merge(departments, all.x=TRUE)
base[, DepartmentID:=NULL]
rm(departments)

# --------------------------------------------------------------- #

final <- copy(base)


final %>% fwrite(sprintf("./target/datafiles/%s.tsv.gz", OUTPUT_NAME), sep="\t")

final  %>% lapply(class) -> tmp

coltodatatype <- data.table(colName=names(tmp),
                            datatype=unlist(tmp),
                            otherArgs=NA_character_)
coltodatatype[colName=="Object_ID", otherArgs:="PRIMARY KEY"]
coltodatatype %>% fwrite(sprintf("./target/datatypes/%s.tsv", OUTPUT_NAME), sep="\t")

