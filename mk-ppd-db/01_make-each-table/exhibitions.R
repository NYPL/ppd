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

exhibitions %>% write.derived.files(OUTPUT_NAME)

