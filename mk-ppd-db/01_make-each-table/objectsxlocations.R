#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "objectsxlocations"

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("Objects")
objs <- mstobjs[, .(ObjectID, Title)]


# --------------------------------------------------------------- #
# Objects <-> Locations xwalk ----------------------------------- #

locs <- read.table.dump("Locations")
locs <- locs[, .(LocationID, Site, Room, LocActive=Active, LocationString)]
locs

components <- read.table.dump("ObjComponents")
components <- components[, .(ObjectID, ComponentID, HomeLocationID)]
components

objs %<>% merge(components, all.x=TRUE)
objs

olocs <- read.table.dump("ObjLocations")
olocs <- olocs[, .(ComponentID, LocationID)]
objs %<>% merge(olocs, all.x=TRUE, by="ComponentID") %>% unique
objs

objs %<>% melt(id.vars=c("ComponentID", "ObjectID", "Title"),
               variable.name="LocationType",
               value.name="LocationID")
objs[LocationType=="HomeLocationID", LocationType:="Home"]
objs[LocationType=="LocationID", LocationType:="Other"]
setorder(objs, "LocationType")
objs <- objs[!duplicated(objs[, .(ComponentID, ObjectID, LocationID)])]
objs <- objs[LocationID!=-1]
setorder(objs, "ObjectID")
objs[, ComponentID:=NULL]
objs

objs %<>% merge(locs, all=FALSE, by="LocationID")
objs %>% names
# !
objs <- objs[, .(ObjectID, Title, LocationID, LocationType, LocActive, LocationString)]
setkey(objs, ObjectID)
objs %<>% unique
objs[ObjectID==5]
objs[, .(ObjectID, LocationType, LocationActive=LocActive,
         LocationString)] -> objs

setorder(objs, "ObjectID", "LocationType")
objs[, rid:=1:.N]
setcolorder(objs, "rid")

final <- copy(objs)

# --------------------------------------------------------------- #

final %<>% normalize.character.columns
setnames(final, separate_words_with_hyphens(names(final)))


final %>% write.derived.files(OUTPUT_NAME)

