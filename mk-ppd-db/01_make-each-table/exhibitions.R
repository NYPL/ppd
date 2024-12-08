#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "exhibitions"

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("Objects")
objs <- mstobjs[, .(ObjectID, Title)]


# --------------------------------------------------------------- #
# EXHIBITIONS -------------------------------------------------- #

exhibitions <- read.table.dump("Exhibitions")
exhibitions %>% names


#  [1] "ExhibitionID"           "ExhType"                "ExhTitle"               "ExhMnemonic"            "ExhDepartment"
#  [6] "PlanningNotes"          "CurNotes"               "RegNotes"               "EntranceFee"            "EstAttendance"
# [11] "ActualAttendance"       "ExhTravelling"          "ExhPicture"             "BoilerText"             "LoginID"
# [16] "EnteredDate"            "BeginYear"              "EndYear"                "DisplayDate"            "DisplayObjID"
# [21] "BeginISODate"           "EndISODate"             "PublicInfo"             "Citation"               "OrganizationCreditLine"
# [26] "SponsorCreditLine"      "SubTitle"               "IsInHouse"              "IsVirtual"              "ProjectNumber"
# [31] "Remarks"                "LabelName1"             "LabelName2"             "LabelName3"             "IndemnityLimit"
# [36] "TransitIndemnityLimit"  "IndemnityBeginDateISO"  "IndemnityEndDateISO"    "LocationID"             "NextDexID"
# [41] "ExhibitionTitleID"      "GSRowVersion"           "LightExpDaysPerWeek"    "LightExpHoursPerDay"    "ExhibitionStatusID"

deps <- read.table.dump("Departments")

exhibitions[, .(ExhDepartment)] %>% nrow
deps %>% nrow
exhibitions %<>% merge(deps[,.(DepartmentID, Department)],
                       by.x="ExhDepartment", by.y="DepartmentID")

exhibitions


# titles
# no need, actually





ExhVenObjXrefs <- read.table.dump("ExhVenObjXrefs")
ExhVenObjXrefs <- ExhVenObjXrefs[, .(ExhVenueXrefID, ObjectID)]
ExhVenObjXrefs

ExhVenuesXrefs <- read.table.dump("ExhVenuesXrefs")
ExhVenuesXrefs <- ExhVenuesXrefs[, .(ExhVenueXrefID, ExhibitionID, ExhVenuesXrefsMneumonic=Mnemonic)]

ExhVenuesXrefs %>% nrow
ExhVenObjXrefs %>% nrow
exhibitions %>% nrow

tmp <- ExhVenuesXrefs %>% merge(ExhVenObjXrefs)
tmp[, .N, ExhVenuesXrefsMneumonic]
tmp %<>% merge(objs, by="ObjectID")

tmp <- exhibitions %>% merge(tmp, by="ExhibitionID")

options(warn=0)
options(warn=2)

checkout <- function(DT) {
  names(DT) %>%
    lapply(function (x) {
      len <- DT[,.N]
      uniqn <- uniqueN(DT[[x]])
      #  TODO  add the single val for num_unique==1 case
      data.table(colName=x,
                 perc_not_na=dt_percent_not_na(DT, x),
                 num_unique=uniqn,
                 perc_unique=round(10000*uniqn/len)/100)
    }) %>% rbindlist
}

# tmp %>% checkout
# tmp %>% checkout -> garb
# garb[order
# delme <- garb[num_unique==1 | perc_not_na < .0001][,colName] %>% as.list
# # delme %>% lapply(function(x) tmp[, get(x):=NULL])
# # tmp
# #
# # do.call(function(x) dt_del_cols(tmp, x), delme)
# #   { function(y) do.call(function (x) dt_del_cols(tmp, y)) }
# # tmp
#
# tmp %>% names

tmp[, .(rid=1:.N, ObjectID, Department, DisplayDate, Title=ExhTitle, Remarks, SponsorCreditLine, OrganizationCreditLine, BoilerText, ProjectNumber)] -> finalp

final <- copy(finalp)

# --------------------------------------------------------------- #

setnames(final, separate_words_with_hyphens(names(final)))

final %>% fwrite(sprintf("./target/datafiles/%s.tsv.gz", OUTPUT_NAME), sep="\t")

almost <- makeDataTypesDT(final)
almost[colName=="rid", otherArgs:="PRIMARY KEY"]
almost[colName=="Object_ID", otherArgs:="REFERENCES main"]
almost %>% fwrite(sprintf("./target/datatypes/%s.tsv", OUTPUT_NAME), sep="\t")

