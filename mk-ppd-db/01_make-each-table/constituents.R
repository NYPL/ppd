#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

# --------------------------------------------------------------- #
# CONSTITUENTS -------------------------------------------------- #

OUTPUT_NAME <- "constituents"

constituents <- read.table.dump("Constituents")
constituents <- constituents[, .(ConstituentID, FirstName, LastName,
                                 Institution, DisplayName, BeginDate,
                                 EndDate, DisplayDate, Nationality)]

setnames(constituents, separate_words_with_hyphens(names(constituents)))

constituents %>%
  fwrite(sprintf("./target/datafiles/%s.tsv.gz", OUTPUT_NAME), sep="\t")

almost <- makeDataTypesDT(constituents)
almost[colName=="Constituent_ID", otherArgs:="PRIMARY KEY"]

almost %>% fwrite(sprintf("./target/datatypes/%s.tsv", OUTPUT_NAME), sep="\t")

