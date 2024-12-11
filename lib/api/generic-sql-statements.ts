
import { DB } from '@/lib/api/attach-db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { attemptToParseInt } from '@/lib/utils';

export const getByIdStatement = (table: string, id_field: string, id: string | number) => {
  const q = `SELECT * FROM ${table} WHERE ${id_field}=?`;
  return DB.prepare(q).bind(id);
};

export const getRecordByID = <T>(table: TableName, field: string, genericID: number, all: boolean=false) => {
  const stm = getByIdStatement(table, field, genericID);
  let r: T;
  if (all) {
    r = stm.all() as T;
  } else {
    r = stm.get() as T;
  }
  if (r === undefined)
    throw new Error ("no results");
  return r;
};

export const makeRecordRetrieverHandler = (table: TableName,
                                           queryKey: string,
                                           field: string,
                                           all: boolean=false) => {
  return  async (req: NextApiRequest, res: NextApiResponse) => {
    const impossibleErrorMessage = "couldn't read id from URL query string";
    Promise.resolve(req.query).
      then((query) => {
        const genericID = query[queryKey] ?? impossibleErrorMessage;
        return Array.isArray(genericID) ? genericID[0] ?? impossibleErrorMessage : genericID
      }).
      then(attemptToParseInt).
      then(_ => getRecordByID(table, field, _, all)).
      then(data => res.status(200).json(data)).
      catch(e => res.status(500).json({ error: e.message }));
  };
};

export const getAllStatement = (table: string) => {
  const q = `SELECT * FROM ${table}`;
  return DB.prepare(q);
};

