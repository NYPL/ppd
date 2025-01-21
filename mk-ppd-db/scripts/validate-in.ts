// @ts-nocheck
// #!/usr/bin/env bun

import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';


interface RowError {
  culpritRow: number;
  culpritCol: string;
  message: string;
  data: any
}


const ARGS = process.argv.slice(2, 4);


if (ARGS.length!=2) {
  console.error("wrong number of arguments");
  console.log("Usage: ./validate-in.ts JSON_FILE_TO_VALIDATE SCHEMA");
  process.exit(1);
}

// const [fileToValidate, schemaFileName] = ARGS;
const [schemaFileName, fileToValidate] = ARGS;


const makeErrorNice = (e: any): RowError => {
  console.log("ERROR:");
  console.log(e.message);
  const { instancePath, message, data } = e;
  const regex = /^\/(\d+)\/(.+)$/;
  const [, culpritRow, culpritCol ] = regex.exec(instancePath)!;
  return { culpritRow: parseInt(culpritRow), culpritCol, message, data };
};


const validateObject = (ajv: Ajv2020, schemaFileName: string, object: any) => {
  const schemaObj = JSON.parse(readFileSync(schemaFileName, 'utf-8'));
  const result = ajv.validate(schemaObj, object);
  if (result) return result;
  console.log(ajv.errors?.map(makeErrorNice));
  throw new Error("validation error");
};

const ajv = new Ajv2020({
  verbose: true,
  allErrors: true,
  strictSchema: false // need special keywords
  // strictSchema: 'log'
});

Promise.resolve(fileToValidate).
  then(_ => readFileSync(_, 'utf-8')).
  then(_ => JSON.parse(_)).
  then(_ => validateObject(ajv, schemaFileName ?? "NO SCHEMA", _)).
  then(_ => { console.log("success"); return _; }).
  catch(e => console.log(e.message));
  // catch(_ => console.log("validation error"));

