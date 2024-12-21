#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "exhibitionsxobjects"

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("Objects")
objs <- mstobjs[, .(ObjectID, Title)]


# --------------------------------------------------------------- #
# EXHIBITIONS <-> Objects xwalk --------------------------------- #

exhibitions <- read.table.dump("Exhibitions")

ExhVenObjXrefs <- read.table.dump("ExhVenObjXrefs")
ExhVenObjXrefs <- ExhVenObjXrefs[, .(ExhVenueXrefID, ObjectID)]

ExhVenuesXrefs <- read.table.dump("ExhVenuesXrefs")
ExhVenuesXrefs <- ExhVenuesXrefs[, .(ExhVenueXrefID, ExhibitionID, ExhVenuesXrefsMneumonic=Mnemonic)]

tmp <- ExhVenuesXrefs %>% merge(ExhVenObjXrefs)
tmp %<>% merge(objs, by="ObjectID")

tmp <- exhibitions %>% merge(tmp, by="ExhibitionID")

tmp <- tmp[, .(rid=1:.N, ExhibitionID, ObjectID)]

final <- copy(tmp)

# --------------------------------------------------------------- #

setnames(final, separate_words_with_hyphens(names(final)))

final %>% write.derived.files(OUTPUT_NAME)

