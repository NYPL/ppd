#!/usr/bin/env node

import fs from 'node:fs/promises';
import os from 'node:os';

const TABLE = process.argv[2];

const INPUT_FILE = `target/datatypes/${TABLE}.tsv`;
const OUTPUT_JSON_FILE = `target/json/${TABLE}.json`;
const OUTPUT_SCHEMA_FILE = `./target/schemas/${TABLE}.sql`;
const RDBMS_TARGET = 'sqlite';
const DATATYPE_XWALK = {
  'sqlite': {
    'character': 'TEXT',
    'integer': 'INTEGER'
  }
};



const backtickify = (_) => {
  const BT = '`';
  return `${BT}${_}${BT}`;
};


const stampSchemaFileContents = (json) => {
  const tmp = json.map(({ data, datatype, otherArgs }) => {
    return `  ${backtickify(data)} ${datatype} ${otherArgs}` 
  }).join(',\n');
  return [
    '',
    `DROP TABLE IF EXISTS ${backtickify(TABLE)};`,
    `CREATE TABLE ${backtickify(TABLE)} (`,
    tmp,
    ') STRICT, WITHOUT ROWID;',
    ''].join('\n');
};


fs.readFile(INPUT_FILE, 'utf-8').
  then(contents => contents.split(os.EOL).slice(1)).
  then(_ => _.filter(i => i!=='')).
  then(_ => _.map(i => {
    const [data, datatype, otherArgs] = i.split('\t');
    return {
      data,
      title: data.replaceAll("_", " "),
      datatype: DATATYPE_XWALK[RDBMS_TARGET][datatype],
      otherArgs
    };
  })).
  // write json to file
  then(json => {
    return fs.writeFile(OUTPUT_JSON_FILE, JSON.stringify(json, null, 2)).
      then(_ => json);
  }).
  then(stampSchemaFileContents).
  then(contents => {
    return fs.writeFile(OUTPUT_SCHEMA_FILE, contents);
  });
  // then(_ => { console.log("done"); });

