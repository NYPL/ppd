#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "objectsxtgn"

# --------------------------------------------------------------- #



tmg <- read.table.dump("TermMasterGeo")
tmg <- tmg[, .(TermMasterID, Lat=LatitudeNumber, Long=LongitudeNumber)]




tmt <- read.table.dump("TermMasterThes")
tmt <- tmt[TermSource=='TGN', .(TermMasterID, Description,
                                TGNID=SourceTermID)][!is.na(TGNID) & TGNID!=0]


tmg %>% merge(tmt, all.x=TRUE) -> geoterms

geoterms


termz <- read.table.dump("Terms")
termz <- termz[, .(TermID, TermMasterID, Term, TermSTID=SourceTermID)]


geoterms %<>% merge(termz, all.x=TRUE, by="TermMasterID")

geoterms

txr <- read.table.dump("ThesXrefs")
txr <- txr[TableID==108, .(ObjectID=ID, TermID)]


objectsxtgn <- txr %>% merge(geoterms, all=FALSE)

setcolorder(objectsxtgn, "ObjectID")
setkey(objectsxtgn, "ObjectID")
setnames(objectsxtgn, "ObjectID", "Object_ID")

objectsxtgn


# 244,276 - has TGN
# 202,336 - does not have TGN
# 446,612 - TOTAL
# 55% of Objects have TGN associated






#  TODO  is there a "DisplayOrder", or something?



# ....



