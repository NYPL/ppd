#!/usr/bin/env -S Rscript --vanilla

source("./01_prelude.R")


OUTPUT_NAME <- "constituents"

# --------------------------------------------------------------- #
# CONSTITUENTS -------------------------------------------------- #


constituents <- read.table.dump("constituents")
constituents <- constituents[, .(Constituent_ID, First_Name, Last_Name,
                                 Institution, Display_Name, Begin_Date,
                                 End_Date, Display_Date, Nationality)]


# --------------------------------------------------------------- #
# ALT NAMES ----------------------------------------------------- #

altn <- read.table.dump("constituent_alt_names")
altn <- altn[, .(Constituent_ID, Name_Type, Alt_Name=Display_Name)]

constituents[, .(Constituent_ID, Display_Name)] %>%
  merge(altn, all.x=TRUE, by="Constituent_ID") -> comb

comb <- comb[Name_Type!="Constituent ID"]
comb <- comb[Display_Name!=Alt_Name]

comb %>% dt_counts_and_percents("Name_Type")

comb[Name_Type=="Alternate Name", .(Display_Name, Alt_Name)]
comb[Name_Type=="Formerly", .(Display_Name, Alt_Name)]
comb[Name_Type=="Alternative Name", .(Display_Name, Alt_Name)]

alts <- comb[, .(Alt_Names=paste0(Alt_Name, collapse=";")), .(Constituent_ID)]

constituents <- constituents %>% merge(alts, all.x=TRUE, by="Constituent_ID")

constituents[, .(Constituent_ID, Display_Name, Display_Date, Nationality,
                 First_Name, Last_Name, Institution, Begin_Date, End_Date,
                 Alt_Names)] -> constituents




constituents %<>% normalize.character.columns
setnames(constituents, separate_words_with_hyphens(names(constituents)))

constituents %>% write.derived.files(OUTPUT_NAME)
