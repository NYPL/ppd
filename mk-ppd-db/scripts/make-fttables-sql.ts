#!/usr/bin/env bun
// @ts-nocheck


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
  ftTables: Array<string>;
}

interface ImportantInfoCol {
  columnName: string;
  ftTables: Array<string> | false;
}

type ImportantInfo = Array<ImportantInfoCol>;


const mainTableSchema: Filename = process.argv[2] || fatal("no main schema given");
const out:  Filename            = "target/sqlschema/full-text.sql";


const getAllSchemas = (dir) => {
  return fs.readdir(dir);
}

const getSchema = (fn: Filename): Schema => {
  return Promise.resolve(fn).
    then(_ => fs.readFile(fn, 'utf-8')).
    then(_ => JSON.parse(_)) as Schema;
};


const getImportantInfo = (sc: any): ImportantInfo => {

  const getColumns = (ss: Subschema) => {

    const getFtTables = (pv: PropValues) => {
      const metadata = pv['$metadata'] ?? false;
      if (!metadata) return false;
      return 'ftTables' in metadata ? metadata['ftTables'] : false;
    };

    const properties = ss.properties!;
    const columns = Object.entries(properties).map(([k, v]) => {
      return {
        columnName: k,
        ftTables:   getFtTables(v)
      };
    });

    return columns;
  };

  const record = sc["$defs"][Object.keys(sc["$defs"])[0]!];
  const columns = getColumns(record);
  return columns;
};



const combine = (info: ImportantInfo) => {
  const left = info.filter(({columnName, ftTables}) => ftTables);
  let relevant = {};
  left.forEach((value) => {
    const { columnName, ftTables } = value;
    ftTables.forEach(_ => {
      // console.log({ that: _ });
      if (!(_ in relevant))
        relevant[_] = [];
      relevant[_].push(columnName);
    });
  });
  return relevant;
};

const createSQLText = (nameOfTable: string, listOfFields: Array<string>) => {
  const joinedListOfFields = listOfFields.join(", ");
  return [
    `CREATE VIRTUAL TABLE ${nameOfTable} USING fts5(`,
    `  ${joinedListOfFields}, content=main, content_rowid=Object_ID`,
    `);`,
    ``,
    `INSERT INTO ${nameOfTable}(`,
    `  rowid, ${joinedListOfFields}`,
    `) SELECT Object_ID, ${joinedListOfFields}`,
    `    FROM main;`
  ].join('\n');

};


const createSQLTexts = (dictOfFtTablesAndFields: any) => {
  return Object.keys(dictOfFtTablesAndFields).map(_ => createSQLText(_, dictOfFtTablesAndFields[_]));
};


Promise.resolve(mainTableSchema).
  then(getSchema).
  then(getImportantInfo).
  then(combine).
  then(createSQLTexts).
  then(_ => _.join('\n--\n\n')).
  then(_ => fs.writeFile(out, _, 'utf-8'));

