#!/usr/bin/env -S Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "main"

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("objects")
main <- mstobjs[Object_ID>=0, .(Object_ID)]



# --------------------------------------------------------------- #
# DEPARTMENTS --------------------------------------------------- #

objs <- mstobjs[, .(Object_ID, Department_ID)]

departments <- read.table.dump("departments")
departments <- departments[, .(Department_ID, Department=Mnemonic)]
departments <- objs %>% merge(departments)

main %<>% merge(departments, all.x=TRUE)
main[, Department_ID:=NULL]
rm(departments)

# --------------------------------------------------------------- #



# --------------------------------------------------------------- #
# CLASSIFICATION ------------------------------------------------- #

withclassifications <- mstobjs[, .(Object_ID, Classification)]

main %<>% merge(withclassifications, all.x=TRUE)

# --------------------------------------------------------------- #



# --------------------------------------------------------------- #
# STATUS FLAGS -------------------------------------------------- #

objs <- mstobjs[, .(Object_ID)]
statusflags <- read.table.dump("object_status_flags")
statusflags <- statusflags[, .(Object_ID, Status_Flag)]

main %<>% merge(statusflags, all.x=TRUE)

# --------------------------------------------------------------- #



# --------------------------------------------------------------- #
# OBJECT TITLES ------------------------------------------------- #

objs <- mstobjs[, .(Object_ID, Title_From_Objects=Title, Portfolio)]

obj.titles <- read.table.dump("object_titles")
obj.titles <- obj.titles[, .(Object_ID, Title_Type, OT.Title=Title, Display_Order)]

objs %<>% merge(obj.titles, all=FALSE, by="Object_ID")

main.titles <- objs[Display_Order==1, .(Object_ID, Main_Title=OT.Title, Portfolio, Title_From_Objects)]

tmp <- objs[Display_Order!=1, .(Object_ID, text=OT.Title, TitleType=sprintf("Title.%s", Title_Type))]

other.titles <- tmp %>% dcast(Object_ID~TitleType, value.var="text", fun.aggregate=function(i)i[1])

alltitles <- main.titles %>% merge(other.titles, all.x=TRUE)

# titles <- objs %>% merge(alltitles, all.x=TRUE, by="ObjectID")
titles <- copy(alltitles)


titles <- titles[, .(Object_ID, Title=Main_Title, Collection=Title.Collection,
           Series=Title.Series, Portfolio, 
           Descriptive_Title=`Title.Descriptive Title`,
           Folder=`Title.Folder or Subseries`,
           Location_Depicted=`Title.Location Depicted`,
           Non_Display_Title=Title.Title,
           Title_From_Objects,
           Alternate_Title=`Title.Alternate Title`,
           Book_or_Album_Title=`Title.Book or Album Title`,
           Additional_Authors=`Title.Additional Authors`,
           Caption=Title.Caption, Title_Continued=`Title.Title (Continued)`,
           Subtitle=`Title.Subtitle or Title Translation`)]

main %<>% merge(titles)
main %<>% unique  #  TODO  revisit this decision

# --------------------------------------------------------------- #


# --------------------------------------------------------------- #
# OBJECT LOCATIONS ---------------------------------------------- #

objs <- mstobjs[, .(Object_ID, Title)]

locs <- read.table.dump("locations")
locs <- locs[, .(Location_ID, Site, Room, LocActive=Is_Active, Location_String)]

components <- read.table.dump("object_components_and_home_locations")
components <- components[, .(Object_ID, Component_ID, Home_Location_ID)]

objs %<>% merge(components, all.x=TRUE)

objhomes <- objs[, .(Object_ID, Location_ID=Home_Location_ID)]
objhomes %<>% merge(locs, all=FALSE, by="Location_ID")
objhomes <- objhomes[, .(Object_ID, Home_Location=Location_String)]

setorder(objhomes, Object_ID)
objhomes <- objhomes[!duplicated(Object_ID)]

main %<>% merge(objhomes, all.x=TRUE)

# --------------------------------------------------------------- #


# --------------------------------------------------------------- #
# FILE LINKS ---------------------------------------------------- #

ovf <- read.table.dump("objects_x_files")
ovf <- ovf[, .(Object_ID, File_ID)]

mf <- read.table.dump("media_files")
mf <- mf[, .(File_ID, Media_Type, Link=sprintf("%s/%s", Path, File_Name))]
mf <- mf[Media_Type=="Image"]
mf <- mf[!str_detect(Link, "^S:")]
mf <- mf[, .(File_ID, Link)]
ovf <- ovf %>% merge(mf, all.x=TRUE, by="File_ID")
thumbs <- ovf[, .(Object_ID, Link)]

main %<>% merge(thumbs, all.x=TRUE)

# --------------------------------------------------------------- #




# --------------------------------------------------------------- #
# CONSTITUENTS -------------------------------------------------- #

objs <- mstobjs[, .(Object_ID, Title)]

cxo <- read.table.dump("constituents_x_objects")
cxo <- cxo[, .(Constituent_ID, Object_ID, Role_Type,
               Role, Display_Order)]
cxo <- cxo[Role_Type=="Object Related", .(Constituent_ID, Object_ID,
                                          Role, Display_Order)]
cxo <- cxo[order(Object_ID, Display_Order)]
cxo <- cxo[!duplicated(Object_ID), .(Constituent_ID, Object_ID, Role)]

cons <- read.table.dump("constituents")
cons <- cons[, .(Constituent_ID, First_Name, Last_Name, Institution,
                 Display_Name, Begin_Date, End_Date, Display_Date,
                 Nationality)]
cxo <- cxo %>% merge(cons, all.x=TRUE)

# the above is for main constituent
maincons <- copy(cxo)

# ---

cxo <- read.table.dump("constituents_x_objects")
cxo <- cxo[, .(Constituent_ID, Object_ID, Role_Type,
               Role, Display_Order)]
cxo <- cxo[Role_Type=="Object Related", .(Constituent_ID, Object_ID,
                                          Role, Display_Order)]
otherconstituents <- cxo %>% merge(cons[, .(Constituent_ID, Display_Name)], all.x=TRUE)
otherconstituents
setorder(otherconstituents, Object_ID, Role, Display_Order)
otherconstituents
otherconstituents %<>% dcast(Object_ID~Role, value.var="Display_Name", fun.aggregate=function(i) i[1])
otherconstituents

withmain <-objs[, .(Object_ID)] %>% merge(maincons, all.x=TRUE)
withmain

tmp <- otherconstituents[, .(Object_ID, After, Explicit_Artist=Artist,
                             Compiler, Editor, Photographer,
                             Printer, Printmaker, Publisher,
                             Sponsor, Subject)]

allcons <- withmain %>% merge(tmp, all.x=TRUE)
allcons[, Constituent_ID:=NULL]

main %<>% merge(allcons, all.x=TRUE)

# --------------------------------------------------------------- #


# --------------------------------------------------------------- #
# GEOGRAPHY ----------------------------------------------------- #

objgeo <- read.table.dump("object_geography")
# objgeo
objgeo <- objgeo[Is_Primary_Display==1, .(Object_ID, Country, State,
                                          County, City, Locus,
                                          Geo_Search_Value)]
# objgeo # !!!
main <- main %>% merge(objgeo, all.x=TRUE)

# --------------------------------------------------------------- #


# --------------------------------------------------------------- #
# VALUES -------------------------------------------------------- #


# acc <- read.table.dump("ObjAccession")
# # ?percent ownership?

ins <- read.table.dump("object_insurance")
ins <- ins[, .(Object_ID, Value=Value_USD)][, .(Value=max(Value)), Object_ID]
ins

main %<>% merge(ins, all.x=TRUE)

# --------------------------------------------------------------- #


# --------------------------------------------------------------- #
# OBJECT VARS PREVIOUSLY LEFT OUT ------------------------------- #

mstobjs <- read.table.dump("objects")
obj <- mstobjs[, .(Object_ID, Object_Number, Object_Count, Medium,
                   Dimensions, Dated, Signed, Inscribed, Markings,
                   Credit_Line, Chat, Description, Provenance,
                   Pub_References, Notes, Curatorial_Remarks,
                   Related_Works, Public_Access,
                   Paper_File_Ref, User_Number1,
                   Object_State=State, Catalogue_Raisonne,
                   Hist_Attributions, Bibliography, Edition,
                   Paper_Support,
                   Is_Template, Date_Remarks, Object_Number2)]




main %>% nrow
obj %>% nrow
main <- main %>% merge(obj)

main <- main[!duplicated(Object_ID)]

final <- main[, .(Object_ID,
                 Department,
                 Object_Number,
                 Classification,
                 Title,
                 Role,
                 First_Name,
                 Last_Name,
                 Medium,
                 Dated,
                 Display_Date,
                 Nationality,
                 Catalogue_Raisonne,
                 Call_Number=Object_Number2,
                 Home_Location,
                 Status_Flag,
                 Object_Count,
                 Dimensions,
                 Begin_Date,
                 End_Date,
                 Value,
                 Geo_Search_Value,
                 Collection,
                 Series,
                 Portfolio,
                 Descriptive_Title,
                 Folder,
                 Depicted_Location=Location_Depicted,
                 Non_Display_Title,
                 Book_or_Album_Title,
                 Link,
                 Display_Name,
                 Institution,
                 After,
                 Explicit_Artist,
                 Compiler,
                 Editor,
                 Photographer,
                 Printer,
                 Printmaker,
                 Publisher,
                 Sponsor,
                 Subject,
                 Country,
                 State,
                 County,
                 City,
                 Locus,
                 Signed,
                 Inscribed,
                 Markings,
                 Credit_Line,
                 Chat,
                 Description,
                 Notes,
                 Provenance,
                 Pub_References,
                 Curatorial_Remarks,
                 Related_Works,
                 Public_Access,
                 Paper_File_Ref,
                 User_Number1,
                 Object_State,
                 Hist_Attributions,
                 Bibliography,
                 Edition,
                 Paper_Support,
                 Is_Template,
                 Date_Remarks)]

final %<>% normalize.character.columns
setnames(final, separate_words_with_hyphens(names(final)))

final %>% write.derived.files(OUTPUT_NAME)

