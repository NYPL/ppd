#!/usr/bin/env node

import fs   from 'node:fs/promises';
import path from 'node:path';
import os   from 'node:os';

const JSCHEMA_FOLDER            = "json-schemas/";
const INPUT_DB_CONSTANTS_FILE   = "target/limits/primary-key-limits.tsv";
const OUTPUT_COLDEFS_FILE       = "target/ppddb/proto-column-definitions.ts";
const OUTPUT_DB_CONSTANTS_FILE  = "target/ppddb/db-constants.ts";


const addFieldsToObj = async (obj) => {
  return Promise.resolve(obj).
    then(obj => obj.map(async (i) => {
      return fs.readFile(i.filename, 'utf-8').
        then(_ => JSON.parse(_)).
        then(_ => {
          const defs = _['$defs'];
          const onlyKey = Object.keys(defs)[0];
          const fields = Object.keys(_['$defs'][onlyKey].properties); //.map(_ => Object.keys(_)[0]);
          return {
            fields: fields.map(_ => {
              return {
                data: _,
                title: _.replaceAll(/_/g, " ")
              }}),
            ...i
          };
        });
    }));
};


const outputColDefFile = async (listOFiles) => {
  const convertToColDefObj = (i) => {
    return {
      [i.tableName]: [...i.fields]
    };
  };

  const combineIntoOne = (p) => {
    const ret = {};
    for (const i of p) {
      const onlyKey = Object.keys(i)[0];
      ret[onlyKey] = i[onlyKey];
    };
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
    then(_ => _.map(i => i.split('\t'))).
    then(_ => _.map(addToRetObj)).
    then(_ => fs.writeFile(OUTPUT_DB_CONSTANTS_FILE,
                           `export const dbConstants = ${JSON.stringify(retObj, null, 2)};`));
};


fs.readdir(JSCHEMA_FOLDER, { recursive: true, withFileTypes: true }).
  then(res => res.filter(i => i.isFile())).
  then(res => res.map(i => {
    return {
      filename: path.join(i.path, i.name),
      tableName: i.name.replace(/.schema.json$/, '')
    };
  })).
  then(addFieldsToObj).
  then(_ => Promise.all(_)).
  then(outputColDefFile).
  then(outputDBConstantsFile);
