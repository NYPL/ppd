#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "exhibitions"

# --------------------------------------------------------------- #
# EXHIBITIONS -------------------------------------------------- #

exhibitions <- read.table.dump("Exhibitions")

deps <- read.table.dump("Departments")

exhibitions %<>% merge(deps[,.(DepartmentID, Department)],
                       by.x="ExhDepartment", by.y="DepartmentID")

exhibitions <- exhibitions[, .(ExhibitionID, Department, Title=ExhTitle,
                               Abbreviation=ExhMnemonic, BoilerText,
                               BeginYear, EndYear, DisplayDate, Remarks,
                               ProjectNumber, Citation, OrganizationCreditLine,
                               SponsorCreditLine, SubTitle, IsInHouse,
                               IsVirtual)]

setnames(exhibitions, separate_words_with_hyphens(names(exhibitions)))

exhibitions %>%
  fwrite(sprintf("./target/datafiles/%s.tsv.gz", OUTPUT_NAME), sep="\t")

almost <- makeDataTypesDT(exhibitions)
almost[colName=="Exhibition_ID", otherArgs:="PRIMARY KEY"]

almost %>% fwrite(sprintf("./target/datatypes/%s.tsv", OUTPUT_NAME), sep="\t")

