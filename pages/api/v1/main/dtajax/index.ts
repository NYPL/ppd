
import { DB } from '@/lib/api/attach-db';
import { dbConstants } from '@/lib/db-constants';
import { Dtajax2sql, DTAJAXParams } from 'dtajax2sql';
import type { NextApiRequest, NextApiResponse } from 'next'

const tableName = 'main';

const dtajax2sql = new Dtajax2sql(tableName, 'sqlite', {
});


export const performAJAX = (params: DTAJAXParams) => {
  const { query, countQuery } = dtajax2sql.toSQL(params);
  //  TODO  added logging based on ENVVARS
  console.log("-------------------");
  console.log(params);
  console.log({ query, countQuery });
  console.log("-------------------");
  //  TODO  this strikes me as inefficient
  //  HACK  this strikes me as inefficient
  const r = DB.prepare(query).all() as MainRecord[];
  const c = DB.prepare(countQuery).get() as {filteredCount: number};
  if (r === undefined)
    throw new Error (`API error. please contact ${process.env["EMAIL"] ?? "the police"}`);
  const ret = {
    "draw": params.draw,
    "recordsTotal": dbConstants[tableName]['numRows'],
    "recordsFiltered": c.filteredCount,
    "data": r
  };
  return ret;
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const impossibleErrorMessage = "couldn't read POST body string";

  return Promise.resolve(req.body ?? impossibleErrorMessage).
    then(performAJAX).
    then(result => res.status(200).json(result)).
    catch(e => res.status(500).json({ error: e.message }));
};


export default handler;
