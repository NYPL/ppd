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

constituents %>% write.derived.files(OUTPUT_NAME)
