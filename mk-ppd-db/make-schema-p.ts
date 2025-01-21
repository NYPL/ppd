// @ts-nocheck
// #!/usr/bin/env bun

/**
  * only "supports" SQLite for now
  */


import { readFile } from 'node:fs/promises';
import { JSONSchema7 } from 'json-schema';

type Filename = string;
type Schema = JSONSchema7;
type Subschema = JSONSchema7;
type ColumnName = string;
type TypeName = string;
type ColumnConstraint = string;
type ColumnDefinition = ColumnName & TypeName & ColumnConstraint; // ColumnConstraint optional

interface PropValues {
  type: string | string[];
  $metadata?: string;
  //  TODO  support minimum, etc...
}



const fatal = (msg: string): never => { console.error(msg); process.exit(1); };
const tee = (a: any) => { console.log(a); return a; };
const tee2 = (a: any) => { console.log(JSON.stringify(a, null, 2)); return a; };
const btIt = (s: string) => '`' + s + '`';

const schemaFileName: Filename = process.argv[2] || fatal("no filename given");


const getSchema = (fn: Filename): Schema => {
  return Promise.resolve(fn).
    then(_ => readFile(fn, 'utf-8')).
    then(_ => JSON.parse(_)) as Schema;
};




const getTNandCC = (pv: PropValues) => {
  const typeName: TypeName = Array.isArray(pv.type) ? pv.type[0]! : pv.type;
  const meta = pv.$metadata ? pv.$metadata : "<blank>";
  return `${typeName} - ${meta}`;
};



const getColumns = (ss: Subschema) => {
  const properties = ss.properties!;
  const columns = Object.entries(properties).map(([k, v]) => `${btIt(k)} ${getTNandCC(v)}`);
  return { columns };
};


const getImportantInfo = (sc: any) => {
  const getFutureTableName = (sc: Schema) => sc.title!.toLowerCase();

  const futureTableName = getFutureTableName(sc);
  const record = sc["$defs"][Object.keys(sc["$defs"])[0]!];
  const { columns } = getColumns(record);
  return {
    futureTableName,
    columns
  };
};


Promise.resolve(schemaFileName).
  then(getSchema).
  then(getImportantInfo).
  // then(_ => readFile(_, 'utf-8')).
  // then(_ => JSON.parse(_)).
  // then(getRecord).
  then(tee2);



