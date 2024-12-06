#!/usr/bin/env node

import fs   from 'node:fs/promises';
import path from 'node:path';
import os   from 'node:os';

const JSON_FOLDER               = "target/json/";
const INPUT_DB_CONSTANTS_FILE   = "target/limits/primary-key-limits.tsv";
const OUTPUT_INTERFACE_FILE     = "target/ppddb/record-types.d.ts";
const OUTPUT_COLDEFS_FILE       = "target/ppddb/proto-column-definitions.ts";
const OUTPUT_DB_CONSTANTS_FILE  = "target/ppddb/db-constants.ts";


const addContentsToObj = async (obj) => {
  return Promise.resolve(obj).
    then(obj => obj.map(async (i) => {
      return fs.readFile(i.filename, 'utf-8').
        then(_ => JSON.parse(_)).
        then(_ => { return { contents: _, ...i }; });
    }));
};


const outputInterfaceFile = async (listOFiles) => {

  const convertToInterface = (obj) => {
    const { tableName, contents } = obj;
    const stampOutInterface = (json) => {
      const interfaceName = `${tableName.slice(0, 1).toUpperCase()}${tableName.slice(1)}Record`;
      const tmp = json.map(({ data, jsDatatype }) => `  ${data}: ${jsDatatype};`);
      return [
        '',
        `declare interface ${interfaceName} {`,
        ...tmp,
        '}',
        ''].join('\n');
    };
    // return "pp";
    return stampOutInterface(contents);
  };

  return Promise.resolve(listOFiles).
    then(_ => _.map(convertToInterface)).
    then(_ => _.join('')).
    then(_ => fs.writeFile(OUTPUT_INTERFACE_FILE, _)).
    then(_ => listOFiles);
};


const outputColDefFile = async (listOFiles) => {

  const combineIntoOne = (listOfPartials) => {
    const ret = {};
    //  HACK  
    listOfPartials.forEach(partial => {
      const theKey = Object.keys(partial)[0];
      ret[theKey] = partial[theKey];
    });
    return ret;
  };

  const convertToColDefObj = (obj) => {
    const { tableName, contents } = obj;
    const tmp = contents.map(i => {
      const { data, title } = i;
      return { data, title };
    });
    const ret = {};
    ret[tableName] = tmp;
    return ret;
  };

  return Promise.resolve(listOFiles).
    then(_ => _.map(convertToColDefObj)).
    then(combineIntoOne).
    then(_ => JSON.stringify(_, null, 2)).
    then(_ => `export const protoColumnDefs = ${_};`).
    then(_ => fs.writeFile(OUTPUT_COLDEFS_FILE, _)).
    then(_ => listOFiles);
};

const outputDBConstantsFile = async () => {
  let retObj = {};

  const addToRetObj = ([tableName, pkey, min, max, numRows]) => {
    retObj[tableName] = {
      primaryKey: pkey,
      min: parseInt(min),
      max: parseInt(max),
      numRows: parseInt(numRows)
    };
  };

  return Promise.resolve(INPUT_DB_CONSTANTS_FILE).
    then(_ => fs.readFile(_, 'utf-8')).
    then(_ => _.split(os.EOL).slice(1).filter(i => i!=="")).
    then(_ => { console.log(_); return _; }).
    then(_ => _.map(i => i.split('\t'))).
    then(_ => _.map(addToRetObj)).
    then(_ => fs.writeFile(OUTPUT_DB_CONSTANTS_FILE,
                           `export const dbConstants = ${JSON.stringify(retObj, null, 2)};`));
};

fs.readdir(JSON_FOLDER, { recursive: true, withFileTypes: true }).
  then(res => res.filter(i => i.isFile())).
  then(res => res.map(i => {
    return {
      filename: path.join(i.path, i.name),
      tableName: i.name.replace(/.json$/, '')
    };
  })).
  then(addContentsToObj).
  then(_ => Promise.all(_)).
  then(outputInterfaceFile).
  then(outputColDefFile).
  then(outputDBConstantsFile);
