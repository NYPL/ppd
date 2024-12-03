// @ts-nocheck

import { DB } from '@/lib/api/attach-db';
import { getParamsAsObject } from '@/lib/utils';
import { Dtajax2sql, DTAJAXParams } from 'dtajax2sql';
import type { NextApiRequest, NextApiResponse } from 'next'

const tableName = 'main';

const dtajax2sql = new Dtajax2sql(tableName, 'sqlite', {
  //  TODO  add more columns to exclude
  excludeFromGlobalSearch: ["Object_ID", "Object_Number"]
});

const totals = DB.prepare(`SELECT COUNT(*) as totalRecords FROM ${tableName}`).get() as {totalRecords: number};


export const performAJAX = (params: DTAJAXParams) => {
  const { query, countQuery } = dtajax2sql.toSQL(params);
  // console.log("-------------------");
  // console.log(params);
  // console.log({ query, countQuery });
  // console.log("-------------------");
  //  TODO  this strikes me as inefficient
  //  HACK  this strikes me as inefficient
  const r = DB.prepare(query).all() as MainRecord[];
  const c = DB.prepare(countQuery).get() as {filteredCount: number};
  if (r === undefined)
    throw new Error (`API error. please contact ${process.env["EMAIL"] ?? "the police"}`);
  const ret = {
    "draw": params.draw,
    "recordsTotal": totals.totalRecords,
    "recordsFiltered": c.filteredCount,
    "data": r
  };
  return ret;
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return Promise.resolve(req.url).
    //  TODO  fix this type error
    then(getParamsAsObject).
    then(performAJAX).
    then(result => res.status(200).json(result)).
    catch(e => res.status(500).json({ error: e.message }));
}

export default handler
