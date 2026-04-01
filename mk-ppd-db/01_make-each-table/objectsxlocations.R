#!/usr/bin/env -S Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "objectsxlocations"

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("objects")
objs <- mstobjs[, .(Object_ID, Title)]


# --------------------------------------------------------------- #
# Objects <-> Locations xwalk ----------------------------------- #

locs <- read.table.dump("locations")
locs <- locs[, .(Location_ID, Site, Room,
                 Loc_Active=Is_Active, Location_String)]
locs

components <- read.table.dump("object_components_and_home_locations")
components <- components[, .(Object_ID, Component_ID)]
components

objs %<>% merge(components, all.x=TRUE)
objs

olocs <- read.table.dump("components_x_moved_locations_history")
olocs <- olocs[, .(Component_ID, Location_ID, Date_Entered)]
objs %<>% merge(olocs, all.x=TRUE, by="Component_ID") %>% unique
objs[, Date_Entered:=str_sub(as.character(Date_Entered), 1, 10)]

objs <- objs[Location_ID!=-1]
setorder(objs, "Object_ID", -"Date_Entered")
objs[, Component_ID:=NULL]
objs <- objs[!duplicated(objs[, .(Object_ID, Location_ID, Date_Entered)])]
objs

objs %<>% merge(locs, all=FALSE, by="Location_ID")
objs <- objs[, .(Object_ID, Loc_Active, Location_String,
                 Location_ISODate=Date_Entered)]
setkey(objs, Object_ID)
objs %<>% unique
objs[Object_ID==5]

setorder(objs, "Object_ID", -"Location_ISODate")
objs[, rid:=1:.N]
setnames(objs, "Loc_Active", "Location_Active")
setcolorder(objs, "rid")

final <- copy(objs)

# --------------------------------------------------------------- #

final %<>% normalize.character.columns
setnames(final, separate_words_with_hyphens(names(final)))


final %>% write.derived.files(OUTPUT_NAME)

