
TODO: write this overall summary

### step 1:

Each R script in `./01_make-each-table` outputs a compressed TSV
that will eventually become its own table in ppd.db. It also outputs
a TSV describing the datatypes of each column (along with other
information used in the construction of the table schema like
PRIMARY KEYS, CONSTRAINTS, REFERENCES, etc...

This step sees the execution of those R scripts

### step 2:

The script `02_create-schemas.mjs` takes a table name (e.g. `main`) as
an argument. Then, it looks up the file (made by step 1) that describes
the datatypes for the columns of that table. Finally, it uses that
information to output two files (for each table)...

- a JSON file that will eventually by used for TS type description and
  the "column definitions" object that DataTables requires

- an SQL file responsible for creating that table (contains the DB datatypes
  and constraints, etc...). These are the "sub-schemas"

### step 3:

The "sub-schemas" described in the last step are concatenated into one
.sql schema file that describes the schema of the whole of ppd.db

It also adds any additional indexes, etc in `03_indexes.sql` and wraps
everything up in a TRANSACTION

