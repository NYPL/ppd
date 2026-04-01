#!/usr/bin/env -S Rscript --vanilla

source("./01_prelude.R")

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("Objects")
objs <- mstobjs[, .(Object_ID, Title)]

# --------------------------------------------------------------- #
# CONSTITUENTS <-> Object xwalk ----------------------------------- #

OUTPUT_NAME <- "constituentsxobjects"

cxo <- read.table.dump("constituents_x_objects")
cons <- cxo[, .(rid=1:.N, Constituent_ID, Object_ID, Role)]

cons %<>% normalize.character.columns
setnames(cons, separate_words_with_hyphens(names(cons)))

cons %>% write.derived.files(OUTPUT_NAME)
