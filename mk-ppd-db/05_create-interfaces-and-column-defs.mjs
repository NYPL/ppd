#!/usr/bin/env node

import fs   from 'node:fs/promises';
import os   from 'node:os';
import path from 'node:path';

const JSON_FOLDER           = "target/json/";
const OUTPUT_INTERFACE_FILE = "target/ppddb/record-types.d.ts";
const OUTPUT_COLDEFS_FILE   = "target/ppddb/proto-column-definitions.ts";


const addContentsToObj = (obj) => {
  return Promise.resolve(obj).
    then(obj => obj.map(i => {
      return fs.readFile(i.filename, 'utf-8').
        then(_ => JSON.parse(_)).
        then(_ => { return { contents: _, ...i }; });
    }));
};


const outputInterfaceFile = (listOFiles) => {

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


const outputColDefFile = (listOFiles) => {

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
  then(outputColDefFile);

