#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "constituents"

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("Objects")


# --------------------------------------------------------------- #
# CONSTITUENTS -------------------------------------------------- #

objs <- mstobjs[, .(ObjectID, Title)]

roletypes <- read.table.dump("RoleTypes")
roletypes <- roletypes[RoleTypeID>0, .(RoleTypeID, RoleType)]

roles <- read.table.dump("Roles")
roles %<>% merge(roletypes)
roles <- roles[, .(RoleID, RoleType, Role)]
roles <- roles[, .(RoleID, RoleType=str_replace(RoleType, " Related$", ""), Role)]

conxrefs <- read.table.dump("ConXrefs")
cons <- conxrefs[TableID==108, .(ConXrefID, ObjectID=ID, RoleID,
                                 CXR.DisplayOrder=DisplayOrder,
                                 CXR.Displayed=Displayed)] %>%
  merge(roles, all=FALSE, by="RoleID")

cxrd <- read.table.dump("ConXrefDetails")
setorder(cxrd, ConXrefID)
cxrd <- cxrd[!duplicated(ConXrefID) & UnMasked==1,
             .(ConXrefID, NameID, ConstituentID, DateBegin, DateEnd,
               Prefix, Suffix, DisplayBioID)]

cons %<>% merge(cxrd, all=FALSE, by="ConXrefID")

constituents <- read.table.dump("Constituents")
constituents <- constituents[, .(ConstituentID, FirstName, LastName,
                                 Institution, DisplayName, BeginDate,
                                 EndDate, DisplayDate, Nationality)]

cons %<>% merge(constituents, all=FALSE, by="ConstituentID")

cons <-  cons[, .(rid=1:.N, ObjectID, RoleType, Role, FirstName, LastName, Institution, DisplayName, BeginDate, EndDate, DisplayDate, Nationality)]

setnames(cons, separate_words_with_hyphens(names(cons)))

cons %>% fwrite(sprintf("./target/datafiles/%s.tsv.gz", OUTPUT_NAME), sep="\t")

almost <- makeDataTypesDT(cons)
almost[colName=="rid", otherArgs:="PRIMARY KEY"]
almost[colName=="Object_ID", otherArgs:="REFERENCES main"]

almost %>% fwrite(sprintf("./target/datatypes/%s.tsv", OUTPUT_NAME), sep="\t")

