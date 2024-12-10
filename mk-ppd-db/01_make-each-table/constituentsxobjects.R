#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("Objects")
objs <- mstobjs[, .(ObjectID, Title)]

# --------------------------------------------------------------- #
# CONSTITUENTS <-> Object xwalk ----------------------------------- #

OUTPUT_NAME <- "constituentsxobjects"

roletypes <- read.table.dump("RoleTypes")
roletypes <- roletypes[RoleTypeID>0, .(RoleTypeID, RoleType)]

roles <- read.table.dump("Roles")
roles %<>% merge(roletypes)
roles <- roles[, .(RoleID, RoleType, Role)]
roles <- roles[, .(RoleID, RoleType=str_replace(RoleType, " Related$", ""), Role)]

tableNameXwalk <- read.table.dump("DDTables")
tableNameXwalk <- tableNameXwalk[, .(TableID, TableName)]

conxrefs <- read.table.dump("ConXrefs")
conxrefs %<>% merge(tableNameXwalk, by="TableID")
conxrefs[, TableID:=NULL]

cons <- conxrefs[, .(ConXrefID, ID, RoleID,
                     TableName, DisplayOrder, Displayed)] %>%
  merge(roles, all=FALSE, by="RoleID")
cons <- cons[TableName=="Objects", .(ConXrefID, ObjectID=ID,
                                     DisplayOrder, Displayed, RoleType,
                                     Role)]

cxrd <- read.table.dump("ConXrefDetails")
setorder(cxrd, ConXrefID)
cxrd <- cxrd[!duplicated(ConXrefID) & UnMasked==1,
             .(ConXrefID, NameID, ConstituentID, DateBegin, DateEnd,
               Prefix, Suffix, DisplayBioID)]

cons %<>% merge(cxrd, all=FALSE, by="ConXrefID")

cons <-  cons[, .(rid=1:.N, ConstituentID, ObjectID, Role)]

setnames(cons, separate_words_with_hyphens(names(cons)))



cons %>%
  fwrite(sprintf("./target/datafiles/%s.tsv.gz", OUTPUT_NAME), sep="\t")

almost <- makeDataTypesDT(cons)
almost[colName=="rid", otherArgs:="PRIMARY KEY"]
almost[colName=="Object_ID", otherArgs:="REFERENCES main"]
almost[colName=="Constituent_ID", otherArgs:="REFERENCES constituents"]

almost %>% fwrite(sprintf("./target/datatypes/%s.tsv", OUTPUT_NAME), sep="\t")
