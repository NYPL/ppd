#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "exhibitions"

# --------------------------------------------------------------- #
# EXHIBITIONS -------------------------------------------------- #

exhibitions <- read.table.dump("exhibitions")
exhibitions

deps <- read.table.dump("departments")

exhibitions %<>% merge(deps[,.(Department_ID, Department)],
                       by="Department_ID")

exhibitions <- exhibitions[, .(Exhibition_ID, Department,
                               Title,
                               Abbreviation=Mnemonic, Boiler_Text,
                               Begin_Year, End_Year, Display_Date,
                               Remarks, Project_Number, Citation,
                               Organization_Credit_Line,
                               Sponsor_Credit_Line, Sub_Title,
                               Is_In_House,
                               IsVirtual=NA)]


exhibitions %<>% normalize.character.columns
setnames(exhibitions, separate_words_with_hyphens(names(exhibitions)))

exhibitions %>% write.derived.files(OUTPUT_NAME)

