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

final %>% fwrite(sprintf("./target/datafiles/%s.tsv.gz", OUTPUT_NAME), sep="\t")

almost <- makeDataTypesDT(final)
almost[colName=="rid", otherArgs:="PRIMARY KEY"]
almost[colName=="Exhibition_ID", otherArgs:="REFERENCES exhibitions"]
almost[colName=="Object_ID", otherArgs:="REFERENCES main"]
almost %>% fwrite(sprintf("./target/datatypes/%s.tsv", OUTPUT_NAME), sep="\t")

