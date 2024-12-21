#!/usr/local/bin/Rscript --vanilla

library(stringr)
library(colorout)
library(jsonlite)
library(jsonvalidate)
library(assertr)
library(magrittr)
library(data.table)
library(crayon)


args <- commandArgs(trailingOnly=TRUE)


DATAFILE    <- args[1]
SCHEMAFILE  <- args[2]
OUTJSONFILE <- args[3]

#  TODO  codex!! tools::file_path_sans_ext
# OUTJSONFILE <- DATAFILE %>%
#   basename %>%
#   str_replace(".(gz|bz2)$", "") %>%
#   (tools::file_path_sans_ext) %>%
#   (function(x) sprintf("target/json/%s.json", x))


checkFileAgainstSchema <- function(dataFile, schemaFile) {
  dat <- data.table::fread(dataFile, na.strings=c("", NA))
  # dat <- dat[1:400000]
  jdat <- jsonlite::toJSON(dat, na="null", pretty=TRUE)
  if (!is.na(OUTJSONFILE)) {
    cat(sprintf(yellow("\nWrote output to file: %s\n"), OUTJSONFILE))
    writeLines(jdat, OUTJSONFILE)
  }
  v <- jsonvalidate::json_validator(SCHEMAFILE, engine='ajv')

  timeElapsed <- system.time(
    result <- jdat %>% v
  )[3] %>% unname

  retVal <- list(valid=result,
                 timeElapsed=timeElapsed,
                 json=jdat,
                 diagnostics=NULL)

  if (!result) {
    result <- jdat %>%
      (function(x) json_validate(x, schemaFile, engine="ajv", verbose=TRUE))
    # print(dat[438:440,])
    errs <- as.data.table(attr(result, "errors"))
    #  HACK  don't str_replace twice (?)
    info <- errs[, .(culpritRow=as.integer(str_replace(instancePath, "/(\\d+).+", "\\1"))+1,
                     culpritCol=str_replace(instancePath, "/.+?/(.+)", "\\1"),
                     message)]
    idk <- sapply(1:info[,.N],
           function(x) {
             dat[info[x, culpritRow]][[info[x, culpritCol]]]
    })
    info$culpritVal <- idk
    diagnostics <- list(numErrors=info[,.N],
                        numFailingRows=info[, uniqueN(culpritRow)],
                        report=info)
    retVal$diagnostics <- diagnostics
  }
  return(retVal)
}



result <- checkFileAgainstSchema(DATAFILE, SCHEMAFILE)

message(sprintf("%s\t[%g seconds]",
                ifelse(result$valid, bold(green("SUCCESS")), bold(red("FAILURE"))),
                result$timeElapsed))

if (!result$valid) {
  cat(sprintf("%s errors across %s rows\n\n",
              red(bold(result$diagnostics$numErrors)),
              red(bold(result$diagnostics$numFailingRows))))
  options(width=120)
  print(head(result$diagnostics$report))
  if (result$diagnostics$numErrors>6)
    cat("...\n")
  quit(status=1)
}

