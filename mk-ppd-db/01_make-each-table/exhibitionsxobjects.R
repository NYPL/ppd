#!/usr/bin/Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "exhibitionsxobjects"

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("Objects")
objs <- mstobjs[, .(Object_ID, Title)]


# --------------------------------------------------------------- #
# EXHIBITIONS <-> Objects xwalk --------------------------------- #

exo <- read.table.dump("exhibitions_x_objects")
exo

tmp <- exo[, .(rid=1:.N, Exhibition_ID, Object_ID)]

final <- copy(tmp)

# --------------------------------------------------------------- #

final %<>% normalize.character.columns
setnames(final, separate_words_with_hyphens(names(final)))

final %>% write.derived.files(OUTPUT_NAME)

