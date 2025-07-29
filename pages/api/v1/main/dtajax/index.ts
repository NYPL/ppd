
import { DB } from '@/lib/api/attach-db';
import { dbConstants } from '@/lib/db-constants';
import { Dtajax2sql, DTAJAXParams } from 'dtajax2sql';
import type { NextApiRequest, NextApiResponse } from 'next'

const tableName = 'main';

const dtajax2sql = new Dtajax2sql(tableName, 'sqlite', {
});


export const performAJAX = (params: DTAJAXParams) => {
  let answer = { query: "", countQuery: "" };

  if ("globalSearchMode" in params && params.globalSearchMode && params.globalSearchMode!=="classic")
    answer = dtajax2sql.toSQLThroughFtTable(params.globalSearchMode, "Object_ID", params);
  else
    answer = dtajax2sql.toSQL(params);

  answer.query = answer.query.normalize("NFD");
  answer.countQuery = answer.query.normalize("NFD");
  const { query, countQuery } = answer;

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

  const makeFtErrorMessage = (msg: string) => {
    return (`\n\nThere's a syntax error in your enhanced search!\n` +
            `You can fix the error or switch back to "Classic" search\n\n` +
            `${msg}`);
  }

  return Promise.resolve(req.body ?? impossibleErrorMessage).
    then(performAJAX).
    then(result => res.status(200).json(result)).
    catch(e => {
      if (e.message.match('fts5. syntax error near'))
        return res.status(500).json({ error: makeFtErrorMessage(e.message) });
      return res.status(500).json({ error: e.message });
    });
};


export default handler;
