#!/usr/bin/env bun
// @ts-nocheck

/**
  * only "supports" SQLite for now
  */


import * as fs from 'node:fs/promises';
import { JSONSchema7 } from 'json-schema';


type Filename = string;
type Schema = JSONSchema7;
type Subschema = JSONSchema7;
type ColumnName = string;
type TypeName = string;
type ColumnConstraint = string;
type ColumnDefinition = ColumnName & TypeName & ColumnConstraint;

interface Metadata {
  foreignKey?: string;
  index?: string;
  primaryKey: boolean;
}

interface PropValues {
  type: string | string[];
  $metadata?: Metadata
  //  TODO  support minimum, etc...
}

interface Column {
  columnName: string;
  dataType: string;
  primaryKey: boolean,
  foreignKeyTo: boolean | string;
  index: boolean | string;
}

interface ImportantInfo {
  futureTableName: string;
  columns: Array<Column>;
}

const schemaDirectory: Filename = process.argv[2] || fatal("no schema directory given");

const schemaOut:  Filename = "target/sqlschema/schema.sql";
const indexesOut: Filename = "target/sqlschema/indexes.sql";

const typeXwalk = {
  "string": "TEXT",
  "integer": "INTEGER",
  "number": "REAL"
};



const btIt = (s: string) => '`' + s + '`';



const xlateMetadata = (metadata) => {
  let xlation = "";
  if ('primaryKey' in metadata && metadata['primaryKey']==true)
    xlation += " PRIMARY KEY";
  if ('foreignKeyTo' in metadata)
    xlation += ` REFERENCES ${metadata['foreignKeyTo']['table']}`;
  return xlation;
};

const getTNandCC = (pv: PropValues) => {

  const getTN = (pv: PropValues) => {
    //  NOTE  can only be <TYPE> or NULL
    if (!Array.isArray(pv.type))
      return `${typeXwalk[pv.type]} NOT NULL`;
    const notNullType = pv.type.find(_ => _!="null");
    return typeXwalk[notNullType];
  };

  const typeName: TypeName = getTN(pv); //Array.isArray(pv.type) ? pv.type[0]! : pv.type;
  const meta = pv.$metadata ? xlateMetadata(pv.$metadata): "";
  return {typeName, meta};
};

const convertInfoToCreateTableStatement = (info: ImportantInfo) => {
  return `CREATE TABLE ${btIt(info.futureTableName)} (\n${info.columns.map(_ => "  " + _).join(",\n")}\n) STRICT, WITHOUT ROWID;\n`;
}


/* --------------------------------------------------------------- */


const getAllSchemas = (dir) => {
  return fs.readdir(dir);
}

const getSchema = (fn: Filename): Schema => {
  return Promise.resolve(fn).
    then(_ => fs.readFile(fn, 'utf-8')).
    then(_ => JSON.parse(_)) as Schema;
};

//  TODO  support constraints
const getImportantInfo = (sc: any): ImportantInfo => {

  const getFutureTableName = (sc: Schema) => sc.title!.toLowerCase();

  const getColumns = (ss: Subschema) => {
    const getDataTypeName = (pv: PropValues) => {
      //  NOTE  can only be <TYPE> or NULL
      if (!Array.isArray(pv.type))
        return `${typeXwalk[pv.type]} NOT NULL`;
      const notNullType = pv.type.find(_ => _!="null");
      return typeXwalk[notNullType];
    };

    const getPrimaryKeyP = (pv: PropValues) => {
      const metadata = pv['$metadata'] ?? false;
      if (!metadata) return false;
      return ('primaryKey' in metadata && metadata['primaryKey']==true);
    };

    const getForeignKeyP = (pv: PropValues) => {
      const metadata = pv['$metadata'] ?? false;
      if (!metadata) return false;
      return 'foreignKeyTo' in metadata ? metadata['foreignKeyTo'] : false;
    };

    const getIndexP = (pv: PropValues) => {
      const metadata = pv['$metadata'] ?? false;
      if (!metadata) return false;
      return 'index' in metadata ? metadata['index'] : false;
    };

    const properties = ss.properties!;
    const columns = Object.entries(properties).map(([k, v]) => {
      return {
        columnName: k,
        dataType:   getDataTypeName(v),
        primaryKey: getPrimaryKeyP(v),
        foreignKey: getForeignKeyP(v),
        index:      getIndexP(v)
      };
    });

    return columns;
  };

  const record = sc["$defs"][Object.keys(sc["$defs"])[0]!];
  const columns = getColumns(record);
  return {
    futureTableName: getFutureTableName(sc),
    columns
  };
};


const distillImportantInfo = (info: ImportantInfo) => {
  let createTableLine = `CREATE TABLE ${btIt(info.futureTableName)} (\n`;
  let fieldLines = [];
  const cols = info.columns.map(({columnName, dataType, primaryKey, foreignKey, index}) => {
    return `${btIt(columnName)} ${dataType}${primaryKey ? " PRIMARY KEY" : ""}${foreignKey ? (" REFERENCES " + foreignKey) : ""}`;
  });
  const indexes = info.columns.map(({columnName, index}) => {
    return index ? `CREATE INDEX ${index} ON ${info.futureTableName} (${columnName});` : null;
  });
  return {
    text: `${createTableLine}${cols.map(_ => "  " + _).join(",\n")}\n) STRICT, WITHOUT ROWID;`,
    index: indexes.filter(_ => _!==null).join("\n") ?? null
  };
}


Promise.resolve(schemaDirectory).
  then(getAllSchemas).
  then(schemas => {
    return Promise.all(schemas.map(_ => {
      return getSchema(`${schemaDirectory}/${_}`).
        then(getImportantInfo);
    }));
  }).
  then(_ => _.map(distillImportantInfo)).
  then(_ => _.map(({text, index}) => {
    fs.appendFile(schemaOut,  `${text}\n\n`,  'utf-8');
    if (index)
      fs.appendFile(indexesOut, `${index}\n\n`, 'utf-8');
  }));



