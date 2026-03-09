#!/usr/bin/Rscript --vanilla

source("./01_prelude.R")

# --------------------------------------------------------------- #
# CONSTITUENTS -------------------------------------------------- #

OUTPUT_NAME <- "constituents"

constituents <- read.table.dump("constituents")
constituents <- constituents[, .(Constituent_ID, First_Name, Last_Name,
                                 Institution, Display_Name, Begin_Date,
                                 End_Date, Display_Date, Nationality)]

constituents %<>% normalize.character.columns
setnames(constituents, separate_words_with_hyphens(names(constituents)))

constituents %>% write.derived.files(OUTPUT_NAME)
