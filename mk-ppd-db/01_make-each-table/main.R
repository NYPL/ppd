#!/usr/local/bin/Rscript --vanilla

source("./01_prelude.R")

OUTPUT_NAME <- "main"

# --------------------------------------------------------------- #

mstobjs <- read.table.dump("Objects")
main <- mstobjs[, .(ObjectID)]

# --------------------------------------------------------------- #
# DEPARTMENTS --------------------------------------------------- #

objs <- mstobjs[, .(ObjectID, DepartmentID)]

departments <- read.table.dump("Departments")
departments <- departments[, .(DepartmentID, Department=Mnemonic)]
departments <- objs %>% merge(departments)

main %<>% merge(departments, all.x=TRUE)
main[, DepartmentID:=NULL]
rm(departments)

# --------------------------------------------------------------- #



# --------------------------------------------------------------- #
# CLASSIFICATION ------------------------------------------------- #

objs <- mstobjs[, .(ObjectID, ClassificationID)]
classifications <- read.table.dump("Classifications")
classifications <- classifications[, .(ClassificationID, Classification)]
classifications
objs %>% merge(classifications, all.x=TRUE) -> withclassifications
withclassifications <- withclassifications[, .(ObjectID, Classification)]

main %<>% merge(withclassifications, all.x=TRUE)

# --------------------------------------------------------------- #



# --------------------------------------------------------------- #
# STATUS FLAGS -------------------------------------------------- #

objs <- mstobjs[, .(ObjectID)]
statusflags <- read.table.dump("StatusFlags")
statusflags <- statusflags[, .(ObjectID, FlagID)]
flaglabels <- read.table.dump("FlagLabels")
flaglabels <- flaglabels[, .(FlagID, StatusFlag=FlagLabel)]
statusflags %<>% merge(flaglabels)
statusflags[, FlagID:=NULL]
statusflags

main %<>% merge(statusflags, all.x=TRUE)

# --------------------------------------------------------------- #



# --------------------------------------------------------------- #
# OBJECT TITLES ------------------------------------------------- #

objs <- mstobjs[, .(ObjectID, Title_From_Objects=Title, Portfolio)]

obj.titles <- read.table.dump("ObjTitles")
obj.titles <- obj.titles[, .(ObjectID, TitleTypeID, OT.Title=Title, DisplayOrder)]

objs %<>% merge(obj.titles, all=FALSE, by="ObjectID")

title.types <- read.table.dump("TitleTypes")
title.types <- title.types[, .(TitleTypeID, TitleType)]
objs %<>% merge(title.types, all=FALSE, by="TitleTypeID")

objs[order(ObjectID, DisplayOrder), TitleType:=str_replace_all(TitleType, "\\W", "")]

main.titles <- objs[DisplayOrder==1, .(ObjectID, MainTitle=OT.Title, Portfolio, Title_From_Objects)]

tmp <- objs[DisplayOrder!=1, .(ObjectID, text=OT.Title, TitleType=sprintf("Title.%s", TitleType))]

other.titles <- tmp %>% dcast(ObjectID~TitleType, value.var="text", fun.aggregate=function(i)i[1])

alltitles <- main.titles %>% merge(other.titles, all.x=TRUE)

# titles <- objs %>% merge(alltitles, all.x=TRUE, by="ObjectID")
titles <- copy(alltitles)


titles <- titles[, .(ObjectID, Title=MainTitle, Collection=Title.Collection,
           Series=Title.Series, Portfolio, 
           Descriptive_Title=Title.DescriptiveTitle,
           Folder=Title.FolderorSubseries,
           Location_Depicted=Title.LocationDepicted,
           Non_Display_Title=Title.Title,
           Title_From_Objects,
           Alternate_Title=Title.AlternateTitle,
           Book_or_Album_Title=Title.BookorAlbumTitle,
           Additional_Authors=Title.AdditionalAuthors,
           Caption=Title.Caption, Title_Continued=Title.TitleContinued,
           Subtitle=Title.SubtitleorTitleTranslation)]

main %<>% merge(titles)
main %<>% unique  #  TODO  revisit this decision

# --------------------------------------------------------------- #


# --------------------------------------------------------------- #
# OBJECT LOCATIONS ---------------------------------------------- #

objs <- mstobjs[, .(ObjectID, Title)]

locs <- read.table.dump("Locations")
locs <- locs[, .(LocationID, Site, Room, LocActive=Active, LocationString)]

components <- read.table.dump("ObjComponents")
components <- components[, .(ObjectID, ComponentID, HomeLocationID, CurrentObjLocID, SortNumber)]

objs %<>% merge(components, all.x=TRUE)

olocs <- read.table.dump("ObjLocations")
olocs <- olocs[, .(ObjLocationID, ComponentID, LocationID)]

objhomes <- objs[, .(ObjectID, LocationID=HomeLocationID)]
objhomes %<>% merge(locs, all=FALSE, by="LocationID")
objhomes <- objhomes[, .(ObjectID, HomeLocation=LocationString)]

setorder(objhomes, ObjectID)
objhomes <- objhomes[!duplicated(ObjectID)]

main %<>% merge(objhomes, all.x=TRUE)

# --------------------------------------------------------------- #


# --------------------------------------------------------------- #
# FILE LINKS ---------------------------------------------------- #

objs <- mstobjs[, .(ObjectID, ObjectNumber, Title)]

media.xrefs <- read.table.dump("MediaXrefs")
media.xrefs <- media.xrefs[TableID==108 & PrimaryDisplay==1, .(MediaMasterID, ObjectID=ID)]
objs %<>% merge(media.xrefs, all=FALSE, by="ObjectID")

media.master <- read.table.dump("MediaMaster")
media.master <- media.master[, .(MediaMasterID, RenditionID=DisplayRendID, PublicCaption)]
objs %<>% merge(media.master, all=FALSE, by="MediaMasterID")

media.paths <- read.table.dump("MediaPaths")
media.paths <- media.paths[PathID %in% c(12,22,24,25,26), .(PathID, Path)]

media.files <- read.table.dump("MediaFiles")
media.files <- media.files[, .(FileID, RenditionID, PathID, FileName)]

thumbs <- media.files %>% merge(media.paths, all=FALSE)
# thumbs[FileID==43426]
thumbs <- thumbs[, .(FileID, RenditionID, Link=sprintf("%s/%s", Path, FileName))]

thumbs <- objs %>% merge(thumbs, all=FALSE, by="RenditionID")

# thumbs[ObjectID==153812]

thumbs <- thumbs[, .(ObjectID, Link)]

main %<>% merge(thumbs, all.x=TRUE)

# --------------------------------------------------------------- #




# --------------------------------------------------------------- #
# CONSTITUENTS -------------------------------------------------- #

objs <- mstobjs[, .(ObjectID, Title)]

roletypes <- read.table.dump("RoleTypes")
roletypes <- roletypes[RoleTypeID>0, .(RoleTypeID, RoleType)]

roles <- read.table.dump("Roles")
roles %<>% merge(roletypes)
roles <- roles[, .(RoleID, RoleType, Role)]
roles <- roles[, .(RoleID, Role=str_replace_all(sprintf("%s.%s", str_replace(RoleType, " Related$", ""), Role), "[^.\\w]", ""))]

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

objs %<>% merge(cons, all.x=TRUE)


mainconstituents <- objs[order(ObjectID, CXR.DisplayOrder)]
#  TODO  re-visit this decision
mainconstituents <- mainconstituents[str_detect(Role, "^Object\\.")]
mainconstituents <- mainconstituents[!duplicated(ObjectID)]

mainconstituents <- mainconstituents[, .(ObjectID, Title,
                     Role=str_replace(Role, "^Object\\.", ""),
                     FirstName, LastName, DisplayName, Nationality,
                     Institution, BeginDate, EndDate,
                     DisplayDate)]

otherconstituents <- objs[order(ObjectID, CXR.DisplayOrder)][duplicated(ObjectID)]
otherconstituents <- otherconstituents[, .(ObjectID, Role=sprintf("Role.%s", Role),
                                           DisplayName)]
otherconstituents[, Role:=str_replace(Role, "^Role.Object.", "")]

otherconstituents %<>% dcast(ObjectID~Role, value.var="DisplayName", fun.aggregate=function(i) i[1])

constituents <- mainconstituents %>% merge(otherconstituents, all.x=TRUE)
constituents[, Title:=NULL]

constituents # !!!
main %<>% merge(constituents, all.x=TRUE)

# --------------------------------------------------------------- #


# --------------------------------------------------------------- #
# GEOGRAPHY ----------------------------------------------------- #

objgeo <- read.table.dump("ObjGeography")
# objgeo
objgeo <- objgeo[PrimaryDisplay==1, .(ObjectID, Country, State,
                                      County, City, Locus,
                                      GeoSearchValue=KeyFieldsSearchValue)]
# objgeo # !!!
main <- main %>% merge(objgeo, all.x=TRUE)

# --------------------------------------------------------------- #


# --------------------------------------------------------------- #
# OBJECT VARS PREVIOUSLY LEFT OUT ------------------------------- #

mstobjs <- read.table.dump("Objects")
obj <- mstobjs[, .(ObjectID, ObjectNumber, ObjectCount, Medium, Dimensions,
                   Dated, Signed, Inscribed, Markings, CreditLine, Chat,
                   Description, Provenance, PubReferences, Notes,
                   CuratorialRemarks, RelatedWorks, PublicAccess,
                   PaperFileRef, UserNumber1, ObjectState=State, CatRais,
                   HistAttributions, Bibliography, Edition, PaperSupport,
                   IsTemplate, DateRemarks, SortNumber2)]




main %>% nrow
obj %>% nrow
main <- main %>% merge(obj)


final <- main[, .(Object_ID=ObjectID,
                 Department,
                 Object_Number=ObjectNumber,
                 Classification,    # NEW
                 Title,
                 Role,
                 First_Name=FirstName,
                 Last_Name=LastName,
                 Medium,
                 Dated,
                 Display_Date=DisplayDate,
                 Nationality,
                 Catalogue_Raisonne=CatRais, # NEW
                 Call_Number=SortNumber2, # NEW
                 Home_Location=HomeLocation,
                 StatusFlag,   # NEW
                 Object_Count=ObjectCount,
                 Dimensions,
                 BeginDate,
                 EndDate,
                 GeoSearchValue,
                 Collection,
                 Series,
                 Portfolio,
                 Descriptive_Title,
                 Folder,
                 Depicted_Location=Location_Depicted,
                 Non_Display_Title,
                 # Title_From_Objects,   NEW
                 Link,
                 Display_Name=DisplayName,
                 Institution,
                 After,
                 Explicit_Artist=Artist,
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
                 # NEW
                 Signed,
                 Inscribed,
                 Markings,
                 CreditLine,
                 Chat,
                 Description,
                 Notes,
                 Provenance,
                 PubReferences,
                 CuratorialRemarks,
                 RelatedWorks,
                 PublicAccess,
                 PaperFileRef,
                 UserNumber1,
                 ObjectState,
                 HistAttributions,
                 Bibliography,
                 Edition,
                 PaperSupport,
                 IsTemplate,
                 DateRemarks )]

setnames(cons, separate_words_with_hyphens(names(cons)))

final %>% fwrite(sprintf("./target/datafiles/%s.tsv.gz", OUTPUT_NAME), sep="\t")


almost <- makeDataTypesDT(final)
almost[colName=="Object_ID", otherArgs:="PRIMARY KEY"]

almost %>% fwrite(sprintf("./target/datatypes/%s.tsv", OUTPUT_NAME), sep="\t")

